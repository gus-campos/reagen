
export function toNullableLocalDate(dateStr: Date | null) {
  if (!dateStr) return null;

  const date = new Date(dateStr);
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() + offset * 60 * 1000);

  return localDate;
}

export function validateDate(date: Date | null, optional: boolean = false) {
  if (!date) {
    if (optional) return null;
    else return 'Selecione uma data';
  }

  return !isNaN(new Date(date).getTime()) ? null : 'Formato inválido';
}
