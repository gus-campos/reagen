import {
  addDoc,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  FirestoreDataConverter,
  Timestamp,
  updateDoc,
} from 'firebase/firestore';
import { Reagent } from '@/src/models/reagent';
import { db } from '@/src/utils/firebase';
import { definitionDocName, uploadEditDefinition } from './definitionsDB';
import { uploadDeleteOperation } from './operationsDB';

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
      inDate: data.inDate instanceof Timestamp ? data.inDate.toDate() : (data.inDate ?? null),
      outDate: data.outDate instanceof Timestamp ? data.outDate.toDate() : (data.outDate ?? null),
      expireDate:
        data.expireDate instanceof Timestamp ? data.expireDate.toDate() : (data.expireDate ?? null),
    } as Reagent;
  },
};

export async function uploadDeleteReagent(reagent: Reagent) {
  // Excluir as operações associadas a ele
  for (const id of reagent.operationsIds) uploadDeleteOperation(id);

  const docRef = doc(db, reagentsDocName, reagent.id);
  await deleteDoc(docRef);
}

export async function uploadAddReagent(reagent: Reagent) {
  try {
    const docRef = await addDoc(collection(db, reagentsDocName), reagent);

    // Adicionar uma associação a sua Definition
    const definitionRef = doc(db, definitionDocName, reagent.definitionId);
    await updateDoc(definitionRef, {
      reagentsId: arrayUnion(docRef.id),
    });
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
