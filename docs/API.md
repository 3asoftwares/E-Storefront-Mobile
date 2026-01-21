# API Integration

## Overview

E-Storefront Mobile connects to the GraphQL Gateway for all data operations.

---

## Endpoints

| Environment | URL                                         |
| ----------- | ------------------------------------------- |
| Production  | https://api.3asoftwares.com/graphql         |
| Staging     | https://staging-api.3asoftwares.com/graphql |
| Development | http://localhost:4000/graphql               |

---

## Authentication

### Login

```graphql
mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    token
    user {
      id
      email
      name
    }
  }
}
```

### Register

```graphql
mutation Register($input: RegisterInput!) {
  register(input: $input) {
    token
    user {
      id
      email
      name
    }
  }
}
```

### Token Storage

```typescript
import * as SecureStore from 'expo-secure-store';

// Store token after login
await SecureStore.setItemAsync('auth_token', token);

// Retrieve token for API calls
const token = await SecureStore.getItemAsync('auth_token');

// Clear token on logout
await SecureStore.deleteItemAsync('auth_token');
```

---

## Products

### Get Products

```graphql
query GetProducts($category: String, $search: String, $page: Int, $limit: Int) {
  products(category: $category, search: $search, page: $page, limit: $limit) {
    products {
      id
      name
      slug
      price
      images
      stock
      category {
        id
        name
      }
    }
    total
    page
    totalPages
  }
}
```

### Get Product Detail

```graphql
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
      slug
    }
    reviews {
      id
      rating
      comment
      user {
        name
      }
      createdAt
    }
  }
}
```

---

## Categories

```graphql
query GetCategories {
  categories {
    id
    name
    slug
    image
    productCount
  }
}
```

---

## Cart

### Add to Cart

```graphql
mutation AddToCart($input: CartItemInput!) {
  addToCart(input: $input) {
    id
    items {
      product {
        id
        name
        price
        images
      }
      quantity
    }
    total
  }
}
```

### Update Cart Item

```graphql
mutation UpdateCartItem($productId: ID!, $quantity: Int!) {
  updateCartItem(productId: $productId, quantity: $quantity) {
    id
    items {
      product {
        id
      }
      quantity
    }
    total
  }
}
```

### Remove from Cart

```graphql
mutation RemoveFromCart($productId: ID!) {
  removeFromCart(productId: $productId) {
    id
    items {
      product {
        id
      }
      quantity
    }
    total
  }
}
```

---

## Orders

### Create Order

```graphql
mutation CreateOrder($input: CreateOrderInput!) {
  createOrder(input: $input) {
    id
    orderNumber
    status
    items {
      product {
        id
        name
      }
      quantity
      price
    }
    total
    shippingAddress {
      street
      city
      state
      zipCode
    }
    createdAt
  }
}
```

### Get User Orders

```graphql
query GetOrders {
  orders {
    id
    orderNumber
    status
    total
    itemCount
    createdAt
  }
}
```

### Get Order Detail

```graphql
query GetOrder($id: ID!) {
  order(id: $id) {
    id
    orderNumber
    status
    items {
      product {
        id
        name
        images
      }
      quantity
      price
    }
    total
    shippingAddress {
      street
      city
      state
      zipCode
      country
    }
    createdAt
    updatedAt
  }
}
```

---

## User Profile

### Get Profile

```graphql
query GetProfile {
  me {
    id
    email
    name
    phone
    avatar
    addresses {
      id
      label
      street
      city
      state
      zipCode
      country
      isDefault
    }
  }
}
```

### Update Profile

```graphql
mutation UpdateProfile($input: UpdateProfileInput!) {
  updateProfile(input: $input) {
    id
    name
    email
    phone
  }
}
```

---

## Addresses

### Add Address

```graphql
mutation AddAddress($input: AddressInput!) {
  addAddress(input: $input) {
    id
    label
    street
    city
    state
    zipCode
    country
    isDefault
  }
}
```

### Update Address

```graphql
mutation UpdateAddress($id: ID!, $input: AddressInput!) {
  updateAddress(id: $id, input: $input) {
    id
    label
    street
    city
    state
    zipCode
  }
}
```

### Delete Address

```graphql
mutation DeleteAddress($id: ID!) {
  deleteAddress(id: $id)
}
```

---

## Error Handling

```typescript
import { ApolloError } from '@apollo/client';

function handleError(error: ApolloError) {
  if (error.networkError) {
    Toast.show('Network error. Please check your connection.');
    return;
  }

  const graphQLError = error.graphQLErrors?.[0];
  if (graphQLError) {
    switch (graphQLError.extensions?.code) {
      case 'UNAUTHENTICATED':
        // Redirect to login
        router.replace('/login');
        break;
      case 'FORBIDDEN':
        Toast.show('You do not have permission to perform this action.');
        break;
      default:
        Toast.show(graphQLError.message);
    }
  }
}
```

---

## Related Documentation

- [Apollo Client](technologies/APOLLO_CLIENT.md) - GraphQL client setup
- [Architecture](ARCHITECTURE.md) - App architecture
- [Authentication](SECURITY.md) - Security details
