export type TableCrudOperations<T> = {
  handleDeleteData?: (data: T) => void;
  handleBeginDataEdit?: (data: T) => void;
  handleClickRow?: (item: T) => void;
  searched?: (data: T) => string;
  dataFilter?: (data: T) => boolean;
};
