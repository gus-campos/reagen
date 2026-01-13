export const normalizeString = (str: string) => {
  return str
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
};

export const searchMatch = (serched: string, searchTerm: string) => {
  return normalizeString(serched).includes(normalizeString(searchTerm));
};
