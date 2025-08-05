import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  FirestoreDataConverter,
  updateDoc,
} from 'firebase/firestore';
import { db } from '@/src/utils/firebase';
import { Definition } from '../models/definition';

type DefinitionFirestoreData = Omit<Definition, 'id'>;

const documentName = 'definitions';

export const definitionConverter: FirestoreDataConverter<Definition> = {
  toFirestore(definition: Definition): DefinitionFirestoreData {
    const { id, ...rest } = definition;
    return rest;
  },
  fromFirestore(snapshot): Definition {
    const data = snapshot.data() as DefinitionFirestoreData;

    return {
      ...data,
      id: snapshot.id,
    } as Definition;
  },
};

export async function uploadDeleteDefinition(definition: Definition) {
  if (!definition.id) {
    console.error('ID do documento não encontrado');
    return;
  }
  const docRef = doc(db, documentName, definition.id);
  await deleteDoc(docRef);
}

export async function uploadAddDefinition(definition: Definition) {
  try {
    const docRef = await addDoc(collection(db, documentName), definition);
  } catch (e) {
    console.error('Erro ao adicionar documento: ', e);
  }
}

export async function uploadEditDefinition(definition: Definition) {
  if (!definition.id) {
    console.error('ID do documento não encontrado');
    return;
  }
  const { id, ...updateData } = definition;
  const docRef = doc(db, documentName, id);
  await updateDoc(docRef, updateData);
}
