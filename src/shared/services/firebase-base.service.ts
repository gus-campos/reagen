import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  FirestoreDataConverter,
  getDocs,
  onSnapshot,
  Timestamp,
  updateDoc,
} from 'firebase/firestore';
import { db } from '@/core/config/firebase';
import { Brand } from '@/features/named-option/brand/brand.type';
import { ControlAgency } from '@/features/named-option/control-agency/control-agency.type';
import { Laboratory } from '@/features/named-option/laboratory/laboratory.type';
import { Supplier } from '@/features/named-option/supplier/supplier.type';
import { Package } from '@/features/package/package.type';
import { Reagent } from '@/features/reagent/reagent.type';
import { Vial } from '@/features/vial/vial.type';
import { IDatabase } from '@/shared/services/base-repository.service';
import { OmitId, WithId } from '@/shared/types/id.type';
import { DatabaseTableName } from '@/shared/types/table-name.type';

export abstract class FirebaseBaseDatabase implements IDatabase {
  async get<T extends WithId>(table: DatabaseTableName) {
    const colRef = collection(db, table).withConverter(FirestoreConverters.get(table));
    const snapshot = await getDocs(colRef);
    return snapshot.docs.map((doc) => doc.data() as T);
  }

  async create<T extends WithId>(table: DatabaseTableName, data: OmitId<T>) {
    const colRef = collection(db, table).withConverter(FirestoreConverters.get(table));
    const docRef = await addDoc(colRef, data as DocumentData);
    return { id: docRef.id, ...data } as T;
  }

  async update<T extends WithId>(table: DatabaseTableName, id: string, data: Partial<OmitId<T>>) {
    const docRef = doc(db, table, id).withConverter(FirestoreConverters.get(table));
    await updateDoc(docRef, data as DocumentData);
  }

  async delete(table: DatabaseTableName, id: string): Promise<void> {
    const docRef = doc(db, table, id);
    await deleteDoc(docRef);
  }

  listen<T extends WithId>(table: DatabaseTableName, callback: (data: T[]) => void) {
    const colRef = collection(db, table).withConverter(FirestoreConverters.get(table));

    const unsubscribe = onSnapshot(colRef, (snapshot) => {
      callback(snapshot.docs.map((doc) => doc.data()));
    });

    return unsubscribe;
  }

  async query<T extends WithId>(table: DatabaseTableName, fn: (item: T) => boolean): Promise<T[]> {
    const items = await this.get<T>(table);
    return items.filter(fn);
  }
}

class FirestoreConverters {
  static get(table: DatabaseTableName) {
    return FirestoreConverters.FIRESTORE_CONVERTERS[table];
  }

  static convertTimestampsToDate = <T>(obj: any): T => {
    if (obj === null || obj === undefined) return obj;

    // Se for um Timestamp do Firestore
    if (obj instanceof Timestamp) return obj.toDate() as any;

    // Se for um array
    if (Array.isArray(obj))
      return obj.map((vial) => FirestoreConverters.convertTimestampsToDate(vial)) as any;

    // Se for um objeto
    if (typeof obj === 'object') {
      const converted: any = {};
      for (const key in obj) {
        if (obj.hasOwn(key)) {
          converted[key] = FirestoreConverters.convertTimestampsToDate(obj[key]);
        }
      }
      return converted;
    }

    // Valores primitivos
    return obj;
  };

  // Converter genérico
  static createFirestoreConverter = <T extends WithId>() => {
    return {
      toFirestore(data: T): OmitId<T> {
        const { id, ...rest } = data;
        return rest as OmitId<T>;
      },

      fromFirestore(snapshot: any): T {
        const data = snapshot.data();
        const converted = FirestoreConverters.convertTimestampsToDate<OmitId<T>>(data);

        return {
          ...converted,
          id: snapshot.id,
        } as T;
      },
    };
  };

  // FIXME: Converter do firabse poderia aprovitar os revivers
  static FIRESTORE_CONVERTERS: Record<DatabaseTableName, FirestoreDataConverter<any>> = {
    [DatabaseTableName.Vial]: FirestoreConverters.createFirestoreConverter<Vial>(),
    [DatabaseTableName.Package]: FirestoreConverters.createFirestoreConverter<Package>(),
    [DatabaseTableName.Reagent]: FirestoreConverters.createFirestoreConverter<Reagent>(),
    [DatabaseTableName.Brand]: FirestoreConverters.createFirestoreConverter<Brand>(),
    [DatabaseTableName.ControlAgency]:
      FirestoreConverters.createFirestoreConverter<ControlAgency>(),
    [DatabaseTableName.Laboratory]: FirestoreConverters.createFirestoreConverter<Laboratory>(),
    [DatabaseTableName.Supplier]: FirestoreConverters.createFirestoreConverter<Supplier>(),
  };
}
