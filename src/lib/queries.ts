
import { collection, query, orderBy, type Query, type DocumentData } from 'firebase/firestore';
import { firestore } from '@/firebase/init';

// User queries
export const getUsersQuery = (): Query<DocumentData> => {
    const usersCol = collection(firestore, 'users');
    return query(usersCol, orderBy('points', 'desc'));
};

// Votable queries
export const getVotablesQuery = (): Query<DocumentData> => {
    const votablesCol = collection(firestore, 'votables');
    return query(votablesCol, orderBy('createdAt', 'desc'));
};

// Vote queries
export const getVotesQuery = (): Query<DocumentData> => {
    return collection(firestore, 'votes');
}
