import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  FirestoreDataConverter,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '@/src/utils/firebase';
import { ControlAgency } from '../models/control-agency';
import { itemConverter, itemsDocName, uploadDeleteItem } from './itemsDB';

export const controlAgenciesDocName = 'control-agencies';

export const controlAgencyConverter: FirestoreDataConverter<ControlAgency> = {
  toFirestore(controlAgency: ControlAgency) {
    const { id, ...rest } = controlAgency;
    return rest;
  },
  fromFirestore(snapshot) {
    const data = snapshot.data() as ControlAgency;
    return {
      ...data,
      id: snapshot.id,
    };
  },
};

export async function uploadAddControlAgency(controlAgency: ControlAgency) {
  try {
    const { id, ...updateData } = controlAgency;
    await addDoc(collection(db, controlAgenciesDocName), updateData);
  } catch (e) {
    console.error('Erro ao adicionar marca: ', e);
  }
}

export async function uploadEditControlAgency(controlAgency: ControlAgency) {
  if (!controlAgency.id) {
    console.error('ID do documento não encontrado');
    return;
  }
  const { id, ...updateData } = controlAgency;
  const docRef = doc(db, controlAgenciesDocName, id);
  await updateDoc(docRef, updateData);
}

export async function uploadDeleteControlAgency(controlAgency: ControlAgency) {
  if (!controlAgency.id) return;
  const docRef = doc(db, controlAgenciesDocName, controlAgency.id);
  deleteRelatedItemsToControlAgency(controlAgency.id);
  await deleteDoc(docRef);
}

export async function getControlAgencies(): Promise<ControlAgency[]> {
  const snapshot = await getDocs(collection(db, controlAgenciesDocName));
  return snapshot.docs.map(
    (d) =>
      ({
        ...d.data(),
        id: d.id,
      }) as ControlAgency
  );
}

async function deleteRelatedItemsToControlAgency(controlAgencyId: string) {
  const itemsRef = collection(db, itemsDocName);
  const q = query(itemsRef, where('controlAgencyId', '==', controlAgencyId));
  const snapshot = await getDocs(q);
  const deletePromises = snapshot.docs.map((d) => uploadDeleteItem(itemConverter.fromFirestore(d)));

  await Promise.all(deletePromises);
}
