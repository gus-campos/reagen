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
import { Item } from '@/src/models/item';
import { db } from '@/src/utils/firebase';
import { reagentsDocName } from './reagentsDB';

type ItemFirestoreData = Omit<Item, 'id'>;

export const itemsDocName = 'items';

export const itemConverter: FirestoreDataConverter<Item> = {
  toFirestore(item: Item): ItemFirestoreData {
    const { id, ...rest } = item;
    return rest;
  },
  fromFirestore(snapshot): Item {
    const data = snapshot.data() as ItemFirestoreData;

    return {
      ...data,
      id: snapshot.id,
      inDate: data.inDate instanceof Timestamp ? data.inDate.toDate() : (data.inDate ?? null),
      expireDate:
        data.expireDate instanceof Timestamp ? data.expireDate.toDate() : (data.expireDate ?? null),
    } as Item;
  },
};

export async function uploadDeleteItem(item: Item) {
  const docRef = doc(db, itemsDocName, item.id);
  await deleteDoc(docRef);
}

export async function uploadAddItem(item: Item) {
  try {
    // Cria o doc
    const { id, ...updateData } = item;
    const docRef = await addDoc(collection(db, itemsDocName), updateData);
    // Atualiza o doc do reagente para incluir o item na sua listagem
    const reagentRef = doc(db, reagentsDocName, item.reagentId);
    await updateDoc(reagentRef, {
      itemsId: arrayUnion(docRef.id),
    });
  } catch (e) {
    console.error('Erro ao adicionar documento: ', e);
  }
}

export async function uploadEditItem(item: Item) {
  if (!item.id) {
    console.error('ID do documento não encontrado');
    return;
  }
  const { id, ...updateData } = item;
  const docRef = doc(db, itemsDocName, id);
  await updateDoc(docRef, updateData);
}
