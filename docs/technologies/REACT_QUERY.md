# React Query (TanStack Query)

## Overview

**Version:** 5.28.0  
**Website:** [https://tanstack.com/query](https://tanstack.com/query)  
**Category:** Server State Management

TanStack React Query is a powerful data fetching and caching library for React and React Native applications.

---

## Why React Query?

### Benefits

| Benefit             | Description                                 |
| ------------------- | ------------------------------------------- |
| **Caching**         | Automatic caching and background updates    |
| **Deduplication**   | Multiple components share same data request |
| **Offline Support** | Built-in offline mode support               |
| **Optimistic UI**   | Optimistic updates with rollback            |
| **Pagination**      | Infinite scroll and pagination support      |
| **DevTools**        | Powerful debugging tools                    |

---

## Setup

### Provider Configuration

```tsx
// app/_layout.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

export default function RootLayout() {
  return <QueryClientProvider client={queryClient}>{/* App content */}</QueryClientProvider>;
}
```

---

## Queries

### Basic Query

```tsx
import { useQuery } from '@tanstack/react-query';

function CategoriesScreen() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/categories`);
      return response.json();
    },
  });

  if (isLoading) return <Loading />;
  if (error) return <Error message={error.message} />;

  return (
    <FlatList
      data={data.categories}
      renderItem={({ item }) => <CategoryCard category={item} />}
      refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
    />
  );
}
```

### Query with Parameters

```tsx
function ProductScreen({ productId }: { productId: string }) {
  const { data: product, isLoading } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => fetchProduct(productId),
    enabled: !!productId,
  });

  // ...
}
```

### Infinite Query (Pagination)

```tsx
import { useInfiniteQuery } from '@tanstack/react-query';

function ProductList() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['products'],
    queryFn: ({ pageParam = 1 }) => fetchProducts(pageParam),
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
    initialPageParam: 1,
  });

  const products = data?.pages.flatMap((page) => page.products) ?? [];

  return (
    <FlatList
      data={products}
      renderItem={({ item }) => <ProductCard product={item} />}
      onEndReached={() => hasNextPage && fetchNextPage()}
      onEndReachedThreshold={0.5}
      ListFooterComponent={isFetchingNextPage ? <ActivityIndicator /> : null}
    />
  );
}
```

---

## Mutations

```tsx
import { useMutation, useQueryClient } from '@tanstack/react-query';

function AddToCartButton({ product }: { product: Product }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (item: CartItem) => addToCart(item),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      Toast.show({ text: 'Added to cart!' });
    },
    onError: (error) => {
      Toast.show({ text: error.message, type: 'error' });
    },
  });

  return (
    <TouchableOpacity
      onPress={() => mutation.mutate({ productId: product.id, quantity: 1 })}
      disabled={mutation.isPending}
    >
      {mutation.isPending ? <ActivityIndicator /> : <Text>Add to Cart</Text>}
    </TouchableOpacity>
  );
}
```

---

## Related Documentation

- [Apollo Client](APOLLO_CLIENT.md) - GraphQL queries
- [Zustand](ZUSTAND.md) - Client state
- [TypeScript](TYPESCRIPT.md) - Type safety
