import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  FirestoreDataConverter,
  Timestamp,
  updateDoc,
} from 'firebase/firestore';
import { Reagent } from '@/src/models/reagent';
import { db } from '@/src/utils/firebase';

type ReagentFirestoreData = Omit<Reagent, 'id'>;

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
      inDate: data.inDate instanceof Timestamp ? data.inDate.toDate() : (data.inDate ?? null),
      outDate: data.outDate instanceof Timestamp ? data.outDate.toDate() : (data.outDate ?? null),
      expireDate:
        data.expireDate instanceof Timestamp ? data.expireDate.toDate() : (data.expireDate ?? null),
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
