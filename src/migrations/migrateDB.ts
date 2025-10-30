import { getFirestore } from 'firebase/firestore';
import { DataService, HasId } from '../services/base/IDataService';

const db = getFirestore();

export async function migrateDB<T extends HasId>(
  service: DataService<T>,
  migrator: (data: T) => T
) {
  const allData = await service.getAll();

  for (const oldData of allData) {
    const newData = migrator(oldData);
    service.update(oldData.id, newData);
    console.log(`=> ${oldData.id} migrado`);
  }
  console.log('=> Migration concluída.');
}
