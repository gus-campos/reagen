import { useEffect, useState } from 'react';
import { DataService } from '../shared/services/data.service';

export function useCollectionData<
  TData extends { id: string },
  TService extends DataService<TData>,
>(service: TService) {
  const [data, setData] = useState<TData[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [dataError, setDataError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      const unsubscribe = service.listen((newData) => {
        setData(newData);
        setLoadingData(false);
      });

      return unsubscribe;
    } catch (err) {
      setDataError(err as Error);
      setLoadingData(false);
    }
  }, [service]);

  const getDataById = (id: string) => {
    if (!data) throw new Error('Dados não foram carregados ainda');
    const found = data.find((d) => d.id === id);
    if (!found) {
      throw new Error('O dado não foi encontrado');
    }
    return found;
  };

  return [data, loadingData, dataError, getDataById] as const;
}
