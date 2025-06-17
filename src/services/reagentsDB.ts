import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  FirestoreDataConverter,
  updateDoc,
} from 'firebase/firestore';
import { Reagent } from '@/src/typings/reagent';
import { db } from '@/src/utils/firebase';

export const reagentConverter: FirestoreDataConverter<Reagent> = {
  toFirestore(reagent: Reagent): Reagent {
    return {
      ...reagent,
      id: null,
    };
  },
  fromFirestore(snapshot): Reagent {
    const data = snapshot.data();

    return {
      ...data,
      id: snapshot.id,
      inDate: data.inDate?.toDate() ?? null,
      outDate: data.outDate?.toDate() ?? null,
      expireDate: data.expireDate?.toDate() ?? null,
    } as Reagent;
  },
};

export async function uploadDeleteReagent(reagent: Reagent) {
  if (!reagent.id) {
    console.error('ID do documento não encontrado');
    return;
  }
  const docRef = doc(db, 'reagents', reagent.id);
  await deleteDoc(docRef);
}

export async function uploadAddReagent(reagent: Reagent) {
  try {
    const docRef = await addDoc(collection(db, 'reagents'), reagent);
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
  const docRef = doc(db, 'reagents', id);
  await updateDoc(docRef, updateData);
}
