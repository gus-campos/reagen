function formattedDate(date: Date | null) {
  if (!date) return 'Não informado';
  if (isNaN(date.getTime())) return 'Data inválida';

  const dia = date.getDate().toString().padStart(2, '0');
  const mes = (date.getMonth() + 1).toString().padStart(2, '0');
  const ano = date.getFullYear();

  return `${dia}/${mes}/${ano}`;
}

export default formattedDate;
