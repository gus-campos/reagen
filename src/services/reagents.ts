import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  FirestoreDataConverter,
  updateDoc,
} from 'firebase/firestore';
import Reagent from '@/src/typings/Reagent';
import { db } from '@/src/utils/firebase';

export const reagentConverter: FirestoreDataConverter<Reagent> = {
  toFirestore(reagent: Reagent) {
    return {
      name: reagent.name,
      amount: reagent.amount,
      unit: reagent.unit,
    };
  },
  fromFirestore(snapshot) {
    const data = snapshot.data();
    return {
      id: snapshot.id,
      name: data.name,
      amount: data.amount,
      unit: data.unit,
    } as Reagent;
  },
};

export async function handleDeleteReagent(reagent: Reagent) {
  if (!reagent.id) {
    console.error('ID do documento não encontrado');
    return;
  }
  const docRef = doc(db, 'reagents', reagent.id);
  await deleteDoc(docRef);
}

export async function handleAddReagent(reagent: Reagent) {
  try {
    const docRef = await addDoc(collection(db, 'reagents'), reagent);
  } catch (e) {
    console.error('Erro ao adicionar documento: ', e);
  }
}

export async function handleEditReagent(reagent: Reagent) {
  if (!reagent.id) {
    console.error('ID do documento não encontrado');
    return;
  }
  const docRef = doc(db, 'reagents', reagent.id);
  await updateDoc(docRef, reagent);
}
