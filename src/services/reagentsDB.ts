import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  FirestoreDataConverter,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '@/src/utils/firebase';
import { Reagent } from '../models/reagent';
import { Size } from '../models/size';
import { itemConverter, itemsDocName, uploadDeleteItem } from './itemsDB';

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

  // Deletar todo os items relacionados
  // TODO: Testar
  deleteRelatedItemsToReagent(reagent.id);

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

  // TODO: Testar

  // 1. Buscar estado atual do reagente
  const docRef = doc(db, reagentsDocName, reagent.id);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) {
    console.error('Reagente não encontrado no Firestore');
    return;
  }
  const current = reagentConverter.fromFirestore(snapshot);

  // 2. Detectar tamanhos removidos
  const removedSizes = current.sizes.filter(
    (prevSize) =>
      !reagent.sizes.some(
        (newSize) => prevSize.unit === newSize.unit && prevSize.amount === newSize.amount
      )
  );

  // 3. Deletar items de cada tamanho removido
  await Promise.all(removedSizes.map((size) => deleteRelatedItemsToSize(size)));

  // 4. Atualizar reagente
  const { id, ...updateData } = reagent;
  await updateDoc(docRef, updateData);
}

async function deleteRelatedItemsToReagent(reagentId: string) {
  const itemsRef = collection(db, itemsDocName);
  const q = query(itemsRef, where('reagentId', '==', reagentId));
  const snapshot = await getDocs(q);
  const deletePromises = snapshot.docs.map((d) => uploadDeleteItem(itemConverter.fromFirestore(d)));

  await Promise.all(deletePromises);
}

async function deleteRelatedItemsToSize(size: Size) {
  const itemsRef = collection(db, itemsDocName);
  const q = query(
    itemsRef,
    where('size.amount', '==', size.amount),
    where('size.unit', '==', size.unit)
  );
  const snapshot = await getDocs(q);
  const deletePromises = snapshot.docs.map((d) => uploadDeleteItem(itemConverter.fromFirestore(d)));

  await Promise.all(deletePromises);
}
