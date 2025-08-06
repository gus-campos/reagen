export function sortKeys<T extends Record<string, any>>(obj: T): Record<string, any> {
  return Object.keys(obj)
    .sort()
    .reduce(
      (acc, key) => {
        acc[key] = obj[key];
        return acc;
      },
      {} as Record<string, any>
    );
}
