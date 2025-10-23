import {
  collection,
  doc,
  DocumentData,
  FirestoreDataConverter,
  getDocs,
  getFirestore,
  setDoc,
} from 'firebase/firestore';

const db = getFirestore();

export async function migrateFirebaseData<T>(
  docName: string,
  converter: FirestoreDataConverter<T, DocumentData>,
  migrator: (data: T) => T
) {
  const collectionRef = collection(db, docName).withConverter(converter);
  const snapshot = await getDocs(collectionRef);

  for (const docSnap of snapshot.docs) {
    const oldData = docSnap.data();
    const newData = migrator(oldData);
    const docRef = doc(db, docName, docSnap.id).withConverter(converter);
    await setDoc(docRef, newData, { merge: true });

    console.log(`Documento ${docSnap.id} migrado`);
  }

  console.log('=> Migration concluída.');
}
