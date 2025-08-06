import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  FirestoreDataConverter,
  Timestamp,
  updateDoc,
} from 'firebase/firestore';
import { db } from '@/src/utils/firebase';
import { Operation } from '../models/operation';

type OperationFirestoreData = Omit<Operation, 'id'>;

export const operationConverter: FirestoreDataConverter<Operation> = {
  toFirestore(operation: Operation): OperationFirestoreData {
    const { id, ...rest } = operation;
    return rest;
  },
  fromFirestore(snapshot): Operation {
    const data = snapshot.data() as OperationFirestoreData;

    return {
      ...data,
      date: data.date instanceof Timestamp ? data.date.toDate() : (data.date ?? null),
      id: snapshot.id,
    } as Operation;
  },
};

export async function uploadDeleteOperation(operation: Operation) {
  if (!operation.id) {
    console.error('ID do documento não encontrado');
    return;
  }
  const docRef = doc(db, 'operations', operation.id);
  await deleteDoc(docRef);
}

export async function uploadAddOperation(operation: Operation) {
  try {
    const docRef = await addDoc(collection(db, 'operations'), operation);
  } catch (e) {
    console.error('Erro ao adicionar documento: ', e);
  }
}

export async function uploadEditOperation(operation: Operation) {
  if (!operation.id) {
    console.error('ID do documento não encontrado');
    return;
  }
  const { id, ...updateData } = operation;
  const docRef = doc(db, 'operations', id);
  await updateDoc(docRef, updateData);
}
