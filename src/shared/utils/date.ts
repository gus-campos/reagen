export function toNullableLocalDate(dateStr: Date | null) {
  if (!dateStr) {
    return null;
  }

  const date = new Date(dateStr);
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() + offset * 60 * 1000);

  return localDate;
}

export function validateDate(date?: Date | null, optional: boolean = false) {
  if (!date) {
    if (optional) {
      return null;
    }
    return 'Selecione uma data';
  }
  return !isNaN(new Date(date).getTime()) ? null : 'Formato inválido';
}

export function stringToLocalDate(dateString: string | Date): Date {
  if (dateString instanceof Date) {
    return new Date(dateString.getFullYear(), dateString.getMonth(), dateString.getDate());
  }
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
}
