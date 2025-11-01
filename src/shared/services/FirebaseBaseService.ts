import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  FirestoreDataConverter,
  getDoc,
  getDocs,
  onSnapshot,
  Timestamp,
  updateDoc,
} from 'firebase/firestore';
import { db } from '@/src/core/config/firebase';
import { DataService, HasId, WithoutId } from './DataService';

export abstract class FirebaseBaseService<T extends HasId> extends DataService<T> {
  private firestorageConverter: FirestoreDataConverter<T>;

  protected constructor(protected collectionName: string) {
    super();
    this.firestorageConverter = this.createFirestoreConverter<T>();
  }

  public async getById(id: string): Promise<T> {
    const docRef = doc(db, this.collectionName, id).withConverter(this.firestorageConverter);
    const snapshot = await getDoc(docRef);

    if (!snapshot.exists()) throw new Error('Dado não encontrado para obtenção');

    return snapshot.data() as T;
  }

  public async getAll(): Promise<T[]> {
    const colRef = collection(db, this.collectionName).withConverter(this.firestorageConverter);
    const snapshot = await getDocs(colRef);
    return snapshot.docs.map((doc) => doc.data() as T);
  }

  public async add(data: WithoutId<T>): Promise<string> {
    const colRef = collection(db, this.collectionName).withConverter(this.firestorageConverter);
    const docRef = await addDoc(colRef, data as DocumentData);
    return docRef.id;
  }

  public async update(id: string, data: Partial<WithoutId<T>>): Promise<void> {
    const docRef = doc(db, this.collectionName, id).withConverter(this.firestorageConverter);
    await updateDoc(docRef, data as DocumentData);
  }

  public async delete(id: string): Promise<void> {
    const docRef = doc(db, this.collectionName, id);
    await deleteDoc(docRef);
  }

  public listen(callback: (data: T[]) => void): () => void {
    const colRef = collection(db, this.collectionName).withConverter(this.firestorageConverter);

    const unsubscribe = onSnapshot(colRef, (snapshot) => {
      callback(snapshot.docs.map((doc) => doc.data()));
    });

    return unsubscribe;
  }

  protected convertTimestampsToDate<T>(obj: any): T {
    if (obj === null || obj === undefined) {
      return obj;
    }

    // Se for um Timestamp do Firestore
    if (obj instanceof Timestamp) {
      return obj.toDate() as any;
    }

    // Se for um array
    if (Array.isArray(obj)) {
      return obj.map((item) => this.convertTimestampsToDate(item)) as any;
    }

    // Se for um objeto
    if (typeof obj === 'object') {
      const converted: any = {};
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          converted[key] = this.convertTimestampsToDate(obj[key]);
        }
      }
      return converted;
    }

    // Valores primitivos
    return obj;
  }

  // Converter genérico
  protected createFirestoreConverter<T extends HasId>() {
    const self = this;

    return {
      toFirestore(data: T): WithoutId<T> {
        const { id, ...rest } = data;
        return rest as WithoutId<T>;
      },

      fromFirestore(snapshot: any): T {
        const data = snapshot.data();
        const converted = self.convertTimestampsToDate<WithoutId<T>>(data);

        return {
          ...converted,
          id: snapshot.id,
        } as T;
      },
    };
  }
}
