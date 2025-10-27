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
import { Brand } from '../models/brand';
import { itemConverter, itemsDocName, uploadDeleteItem } from './itemsDB';

export const brandsDocName = 'brands';

export const brandConverter: FirestoreDataConverter<Brand> = {
  toFirestore(brand: Brand) {
    const { id, ...rest } = brand;
    return rest;
  },
  fromFirestore(snapshot) {
    const data = snapshot.data() as Brand;
    return {
      ...data,
      id: snapshot.id,
    };
  },
};

export async function uploadAddBrand(brand: Brand) {
  try {
    const { id, ...updateData } = brand;
    await addDoc(collection(db, brandsDocName), updateData);
  } catch (e) {
    console.error('Erro ao adicionar marca: ', e);
  }
}

export async function uploadEditBrand(brand: Brand) {
  if (!brand.id) {
    console.error('ID do documento não encontrado');
    return;
  }
  const { id, ...updateData } = brand;
  const docRef = doc(db, brandsDocName, id);
  await updateDoc(docRef, updateData);
}

export async function uploadDeleteBrand(brand: Brand) {
  if (!brand.id) return;
  const docRef = doc(db, brandsDocName, brand.id);
  deleteRelatedItemsToBrand(brand.id);
  await deleteDoc(docRef);
}

export async function getBrands(): Promise<Brand[]> {
  const snapshot = await getDocs(collection(db, brandsDocName));
  return snapshot.docs.map(
    (d) =>
      ({
        ...d.data(),
        id: d.id,
      }) as Brand
  );
}

async function deleteRelatedItemsToBrand(brandId: string) {
  const itemsRef = collection(db, itemsDocName);
  const q = query(itemsRef, where('brandId', '==', brandId));
  const snapshot = await getDocs(q);
  const deletePromises = snapshot.docs.map((d) => uploadDeleteItem(itemConverter.fromFirestore(d)));

  await Promise.all(deletePromises);
}
