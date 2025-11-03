
'use server';

import { collection, doc, getDoc, getDocs, setDoc, deleteDoc, runTransaction, query, where, orderBy, Timestamp, writeBatch, documentId, addDoc } from 'firebase/firestore';
import { firestore } from '@/firebase/init';
import type { User, Votable, Vote } from './definitions';

// User functions
export const getUsers = async (): Promise<User[]> => {
    const usersCol = collection(firestore, 'users');
    const q = query(usersCol, orderBy('points', 'desc'));
    const userSnapshot = await getDocs(q);
    const users = userSnapshot.docs.map(doc => ({...doc.data(), id: doc.id} as User));
    return users;
};

export const getUserByName = async (name: string): Promise<User | undefined> => {
    const usersCol = collection(firestore, 'users');
    const q = query(usersCol, where("name_lowercase", "==", name.toLowerCase()));
    const userSnapshot = await getDocs(q);
    if (userSnapshot.empty) {
        return undefined;
    }
    const userDoc = userSnapshot.docs[0];
    return {...userDoc.data(), id: userDoc.id} as User;
};

export const addOrUpdateUserAndGetId = async (name: string): Promise<string> => {
    const existingUser = await getUserByName(name);
    if (existingUser) {
        return existingUser.id;
    }

    const newUser: Omit<User, 'id'> & { name_lowercase: string } = {
        name,
        points: 0,
        name_lowercase: name.toLowerCase(),
    };
    const newDocRef = await addDoc(collection(firestore, 'users'), newUser);
    return newDocRef.id;
};


// Votable functions
export const getVotables = async (): Promise<Votable[]> => {
    const votablesCol = collection(firestore, 'votables');
    // The composite index was removed to prevent errors on first load.
    // The data is now sorted client-side to show special events first.
    const q = query(votablesCol, orderBy('createdAt', 'desc'));
    const votableSnapshot = await getDocs(q);
    const votables = votableSnapshot.docs.map(doc => {
        const data = doc.data();
        return { 
            ...data, 
            id: doc.id,
            createdAt: (data.createdAt as Timestamp)?.toDate().toISOString()
        } as Votable
    });
    // Manually sort to prioritize special events
    return votables.sort((a, b) => (b.isSpecialEvent ? 1 : 0) - (a.isSpecialEvent ? 1 : 0));
};

export const getVotableById = async (id: string): Promise<Votable | undefined> => {
    const votableDoc = doc(firestore, 'votables', id);
    const votableSnapshot = await getDoc(votableDoc);
    if (!votableSnapshot.exists()) {
        return undefined;
    }
    const data = votableSnapshot.data();
    return { 
        ...data, 
        id: votableSnapshot.id,
        createdAt: (data.createdAt as Timestamp).toDate().toISOString()
    } as Votable;
};

export async function addVotable(votableData: Omit<Votable, 'id' | 'createdAt' | 'outcome'> & { outcome: null }) {
    const newDocRef = doc(collection(firestore, 'votables'));
    const data = {
        ...votableData,
        createdAt: Timestamp.now(),
    };
    await setDoc(newDocRef, data);
    await addOrUpdateUserAndGetId(votableData.creatorName);
};

export const deleteVotableById = async (id: string) => {
    const votableDoc = doc(firestore, 'votables', id);
    const votesQuery = query(collection(firestore, 'votes'), where('votableId', '==', id));
    
    const batch = writeBatch(firestore);
    const votesSnapshot = await getDocs(votesQuery);
    votesSnapshot.forEach(voteDoc => {
        batch.delete(voteDoc.ref);
    });
    batch.delete(votableDoc);
    await batch.commit();
};


// Vote functions
export const getVotesForVotable = async (votableId: string): Promise<Vote[]> => {
    const votesCol = collection(firestore, 'votes');
    const q = query(votesCol, where('votableId', '==', votableId));
    const voteSnapshot = await getDocs(q);
    return voteSnapshot.docs.map(doc => ({...doc.data(), id: doc.id} as Vote));
};

export const getVotesForVotables = async (votableIds: string[]): Promise<Record<string, Vote[]>> => {
    if (votableIds.length === 0) {
        return {};
    }
    const votesCol = collection(firestore, 'votes');
    const q = query(votesCol, where('votableId', 'in', votableIds));
    const voteSnapshot = await getDocs(q);
    const votesByVotable: Record<string, Vote[]> = {};
    votableIds.forEach(id => { votesByVotable[id] = [] });

    voteSnapshot.docs.forEach(doc => {
        const vote = {...doc.data(), id: doc.id} as Vote;
        if(votesByVotable[vote.votableId]) {
            votesByVotable[vote.votableId].push(vote);
        }
    });
    return votesByVotable;
};


export async function addOrUpdateVote(voteData: Omit<Vote, 'id'>) {
    const voteQuery = query(
        collection(firestore, 'votes'),
        where('voterName_lowercase', '==', voteData.voterName.toLowerCase()),
        where('votableId', '==', voteData.votableId)
    );

    const snapshot = await getDocs(voteQuery);
    if (!snapshot.empty) {
        throw new Error('You have already voted on this item.');
    }
    
    const newDocRef = doc(collection(firestore, 'votes'));
    const data = { 
        ...voteData, 
        id: newDocRef.id,
        voterName_lowercase: voteData.voterName.toLowerCase()
    };
    await setDoc(newDocRef, data);
    await addOrUpdateUserAndGetId(voteData.voterName);
}


// Resolve Votable and distribute points
export const resolveVotable = async (id: string, outcome: 'happened' | 'not_happened') => {
  await runTransaction(firestore, async (transaction) => {
    const votableRef = doc(firestore, 'votables', id);
    const votableDoc = await transaction.get(votableRef);

    if (!votableDoc.exists() || votableDoc.data().status !== 'open') {
      throw new Error("Votable is not open for resolution or does not exist.");
    }

    transaction.update(votableRef, { status: 'closed', outcome: outcome });

    const votesQuery = query(collection(firestore, 'votes'), where('votableId', '==', id));
    const votesSnapshot = await getDocs(votesQuery);

    const userPointsUpdate: Record<string, number> = {};

    votesSnapshot.docs.forEach(voteDoc => {
        const vote = voteDoc.data() as Vote;
        const pointsChange = vote.prediction === outcome ? 10 : -5;
        const voterNameLower = vote.voterName.toLowerCase();
        userPointsUpdate[voterNameLower] = (userPointsUpdate[voterNameLower] || 0) + pointsChange;
    });

    const userNamesLower = Object.keys(userPointsUpdate);
    if(userNamesLower.length === 0) return;

    const usersQuery = query(collection(firestore, 'users'), where('name_lowercase', 'in', userNamesLower));
    const usersSnapshot = await getDocs(usersQuery);

    usersSnapshot.forEach(userDoc => {
        const user = {...userDoc.data(), id: userDoc.id} as User & { name_lowercase: string };
        const pointsToAdd = userPointsUpdate[user.name_lowercase];
        if (pointsToAdd) {
            const userRef = doc(firestore, 'users', user.id);
            const newPoints = (user.points || 0) + pointsToAdd;
            transaction.update(userRef, { points: newPoints });
        }
    });

  });
};
