export function formattedDate(date: Date | null) {
  if (!date) return '';
  if (isNaN(date.getTime())) throw new Error('Data inválida');

  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  };

  return new Intl.DateTimeFormat('pt-BR', options).format(date);
}
