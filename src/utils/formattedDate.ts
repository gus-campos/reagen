function formattedDate(date: Date | null) {
  if (!date) return 'Não informado';
  if (isNaN(date.getTime())) return 'Data inválida';

  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  };

  return new Intl.DateTimeFormat('pt-BR', options).format(date);
}

export default formattedDate;
