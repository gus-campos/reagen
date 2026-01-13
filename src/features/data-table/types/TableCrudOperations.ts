export type TableCrudOperations<T> = {
  handleDeleteData?: (data: T) => void;
  handleBeginDataEdit?: (data: T) => void;
  handleClickRow?: (vial: T) => void;
  searched?: (data: T) => string;
  dataFilter?: (data: T) => boolean;
  onChangeExpandedData?: (data: T | null) => void;
};
