
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { addVotable, deleteVotableById, addOrUpdateVote, resolveVotable, getVotableById, addOrUpdateUserAndGetId, getVotesForVotable } from './data';
import type { Votable } from './definitions';

const VotableSchema = z.object({
  title: z.string().min(10, { message: 'Prediction title must be at least 10 characters long.' }),
  description: z.string().optional(),
  creatorName: z.string().min(2, { message: 'Name must be at least 2 characters long.' }),
  passcode: z.string().min(4, { message: 'Passcode must be at least 4 characters long.' }),
  isSpecialEvent: z.boolean(),
});

export async function createVotable(prevState: any, formData: FormData) {
  const validatedFields = VotableSchema.safeParse({
    title: formData.get('title'),
    description: formData.get('description'),
    creatorName: formData.get('creatorName'),
    passcode: formData.get('passcode'),
    isSpecialEvent: formData.get('isSpecialEvent') === 'on',
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Failed to create votable.',
    };
  }
  
  const { title, description, creatorName, passcode, isSpecialEvent } = validatedFields.data;

  try {
    await addVotable({
      creatorName,
      title,
      description,
      passcode,
      status: 'open',
      outcome: null,
      isSpecialEvent,
    } as Omit<Votable, 'id' | 'createdAt' | 'outcome'> & { outcome: null });
  } catch (error) {
    return { message: 'Database Error: Failed to create votable.' };
  }

  revalidatePath('/dashboard');
  return { message: 'success' };
}

export async function deleteVotable(votableId: string, creatorName: string, passcode: string) {
  const votable = await getVotableById(votableId);

  if (!votable) {
    throw new Error('Votable not found.');
  }

  if (creatorName.toLowerCase() !== votable.creatorName.toLowerCase() || passcode !== votable.passcode) {
    throw new Error('You are not authorized to delete this votable.');
  }
  
  try {
    await deleteVotableById(votableId);
    revalidatePath('/dashboard');
  } catch (error) {
    throw new Error('Database Error: Failed to delete votable.');
  }

}

export async function submitVote(votableId: string, prediction: 'happened' | 'not_happened', voterName: string) {
  if (!voterName || voterName.trim().length < 2) {
    throw new Error('You must provide a valid name to vote.');
  }

  const votable = await getVotableById(votableId);
  if (!votable || votable.status === 'closed') {
    throw new Error('This votable is not open for voting.');
  }

  try {
    await addOrUpdateVote({
      voterName,
      votableId,
      prediction,
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Database Error: Failed to submit vote.');
  }

  revalidatePath('/dashboard');
}

export async function resolveVotableAction(votableId: string, outcome: 'happened' | 'not_happened', creatorName: string, passcode: string) {
  const votable = await getVotableById(votableId);

  if (!votable) {
    throw new Error('Votable not found');
  }

  if (creatorName.toLowerCase() !== votable.creatorName.toLowerCase() || passcode !== votable.passcode) {
    return { message: 'Incorrect name or passcode.' };
  }

  try {
    await resolveVotable(votableId, outcome);
  } catch (error) {
    if (error instanceof Error) {
        return { message: `Database Error: ${error.message}` };
    }
    return { message: 'Database Error: Failed to resolve votable.' };
  }
  
  revalidatePath('/dashboard');
  revalidatePath('/leaderboard');
  return { message: 'success' };
}

export async function getVotableWithVotes(votableId: string) {
    const votable = await getVotableById(votableId);
    if (!votable) return null;
    const votes = await getVotesForVotable(votableId);
    return { ...votable, votes };
}
