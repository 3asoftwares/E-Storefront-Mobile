# Apollo Client

## Overview

**Version:** 3.8.10  
**Website:** [https://www.apollographql.com/docs/react](https://www.apollographql.com/docs/react)  
**Category:** GraphQL Client

Apollo Client is a comprehensive state management library for JavaScript that enables you to manage both local and remote data with GraphQL.

---

## Why Apollo Client?

### Benefits

| Benefit               | Description                                 |
| --------------------- | ------------------------------------------- |
| **GraphQL Native**    | Built specifically for GraphQL              |
| **Intelligent Cache** | Normalized caching reduces network requests |
| **React Native**      | Full React Native support                   |
| **Type Safety**       | Full TypeScript integration                 |
| **DevTools**          | Debugging with Apollo DevTools              |

---

## Setup

### Client Configuration

```typescript
// lib/apollo/client.ts
import { ApolloClient, InMemoryCache, HttpLink, ApolloLink, from } from '@apollo/client';
import * as SecureStore from 'expo-secure-store';

const httpLink = new HttpLink({
  uri: process.env.EXPO_PUBLIC_GRAPHQL_URL,
});

const authLink = new ApolloLink((operation, forward) => {
  return SecureStore.getItemAsync('auth_token').then((token) => {
    operation.setContext(({ headers = {} }) => ({
      headers: {
        ...headers,
        ...(token && { authorization: `Bearer ${token}` }),
      },
    }));
    return forward(operation);
  });
});

export const apolloClient = new ApolloClient({
  link: from([authLink, httpLink]),
  cache: new InMemoryCache(),
});
```

### Provider Setup

```tsx
// app/_layout.tsx
import { ApolloProvider } from '@apollo/client';
import { apolloClient } from '@/lib/apollo/client';

export default function RootLayout() {
  return <ApolloProvider client={apolloClient}>{/* App content */}</ApolloProvider>;
}
```

---

## Queries

### Define Query

```typescript
// lib/apollo/queries/products.ts
import { gql } from '@apollo/client';

export const GET_PRODUCTS = gql`
  query GetProducts($category: String, $page: Int, $limit: Int) {
    products(category: $category, page: $page, limit: $limit) {
      products {
        id
        name
        price
        images
        stock
      }
      total
      page
      totalPages
    }
  }
`;

export const GET_PRODUCT = gql`
  query GetProduct($id: ID!) {
    product(id: $id) {
      id
      name
      description
      price
      images
      stock
      category {
        id
        name
      }
    }
  }
`;
```

### Use Query

```tsx
import { useQuery } from '@apollo/client';
import { GET_PRODUCTS } from '@/lib/apollo/queries/products';

function ProductList({ category }: { category?: string }) {
  const { data, loading, error, refetch } = useQuery(GET_PRODUCTS, {
    variables: { category, page: 1, limit: 20 },
  });

  if (loading) return <Loading />;
  if (error) return <Error message={error.message} />;

  return (
    <FlatList
      data={data.products.products}
      renderItem={({ item }) => <ProductCard product={item} />}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={() => refetch()} />}
    />
  );
}
```

---

## Mutations

```typescript
// lib/apollo/mutations/cart.ts
import { gql } from '@apollo/client';

export const ADD_TO_CART = gql`
  mutation AddToCart($input: CartItemInput!) {
    addToCart(input: $input) {
      id
      items {
        product {
          id
          name
          price
        }
        quantity
      }
      total
    }
  }
`;
```

```tsx
import { useMutation } from '@apollo/client';

function AddToCartButton({ productId }: { productId: string }) {
  const [addToCart, { loading }] = useMutation(ADD_TO_CART, {
    onCompleted: () => {
      Toast.show('Added to cart!');
    },
    onError: (error) => {
      Toast.show(error.message);
    },
  });

  return (
    <TouchableOpacity
      onPress={() =>
        addToCart({
          variables: {
            input: { productId, quantity: 1 },
          },
        })
      }
      disabled={loading}
    >
      <Text>{loading ? 'Adding...' : 'Add to Cart'}</Text>
    </TouchableOpacity>
  );
}
```

---

## Related Documentation

- [React Query](REACT_QUERY.md) - REST API fetching
- [Zustand](ZUSTAND.md) - Client state
- [TypeScript](TYPESCRIPT.md) - Type safety
