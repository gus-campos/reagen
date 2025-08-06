export enum OperationType {
  BASE = 'Base',
  INPUT = 'Entrada',
  TRANSFER = 'Transferência',
  CONSUMPTION = 'Consumo',
  DISPOSAL = 'Descarte',
}

type BaseOperation = {
  id: string;
  reagentId: string;
  date: Date;
  notes?: string;
};

type InputOperation = BaseOperation & {
  type: OperationType.INPUT;
  source: string;
};

type TransferOperation = BaseOperation & {
  type: OperationType.TRANSFER;
  from: string;
  to: string;
};

type ConsumptionOperation = BaseOperation & {
  type: OperationType.CONSUMPTION;
};

type DisposalOperation = BaseOperation & {
  type: OperationType.DISPOSAL;
};

export type Operation =
  | InputOperation
  | TransferOperation
  | ConsumptionOperation
  | DisposalOperation;
