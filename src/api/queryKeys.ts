export const productQueryKeys = {
  all: ["products"] as const,

  lists: () => [...productQueryKeys.all, "list"] as const,

  list: (searchTerm: string, page: number) =>
    [...productQueryKeys.lists(), { searchTerm, page }] as const,

  details: () => [...productQueryKeys.all, "detail"] as const,

  detail: (id: string) => [...productQueryKeys.details(), id] as const,
};
