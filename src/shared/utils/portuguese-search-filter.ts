import { ComboboxItem, ComboboxParsedItem } from '@mantine/core';
import { normalizeString } from '@/src/features/data-table/components/DataTable';

export function portugueseSearchFilter({
  options,
  search,
}: {
  options: ComboboxParsedItem[];
  search: string;
}) {
  const normalizedSearch = normalizeString(search);

  return options.filter((item): item is ComboboxParsedItem => {
    if ('group' in item && item.items) {
      return item.items.some((opt) => normalizeString(opt.label).includes(normalizedSearch));
    }
    if ('label' in item) {
      return normalizeString(item.label).includes(normalizedSearch);
    }
    return false;
  });
}
