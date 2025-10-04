import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  FirestoreDataConverter,
  updateDoc,
} from 'firebase/firestore';
import { db } from '@/src/utils/firebase';
import { Reagent } from '../models/reagent';

type ReagentFirestoreData = Omit<Reagent, 'id'>;

export const reagentsDocName = 'reagents';

export const reagentConverter: FirestoreDataConverter<Reagent> = {
  toFirestore(reagent: Reagent): ReagentFirestoreData {
    const { id, ...rest } = reagent;
    return rest;
  },
  fromFirestore(snapshot): Reagent {
    const data = snapshot.data() as ReagentFirestoreData;

    return {
      ...data,
      id: snapshot.id,
    } as Reagent;
  },
};

export async function uploadDeleteReagent(reagent: Reagent) {
  const docRef = doc(db, reagentsDocName, reagent.id);
  await deleteDoc(docRef);
}

export async function uploadAddReagent(reagent: Reagent) {
  try {
    const docRef = await addDoc(collection(db, reagentsDocName), reagent);
  } catch (e) {
    console.error('Erro ao adicionar documento: ', e);
  }
}

export async function uploadEditReagent(reagent: Reagent) {
  if (!reagent.id) {
    console.error('ID do documento não encontrado');
    return;
  }
  const { id, ...updateData } = reagent;
  const docRef = doc(db, reagentsDocName, id);
  await updateDoc(docRef, updateData);
}
