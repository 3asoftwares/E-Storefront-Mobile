# TypeScript

## Overview

**Version:** 5.3  
**Website:** [https://www.typescriptlang.org](https://www.typescriptlang.org)  
**Category:** Programming Language

TypeScript is a strongly typed programming language that builds on JavaScript, providing better tooling at any scale.

---

## Why TypeScript?

### Benefits

| Benefit             | Description                          |
| ------------------- | ------------------------------------ |
| **Type Safety**     | Catch errors at compile time         |
| **IDE Support**     | Better autocomplete and refactoring  |
| **Documentation**   | Types serve as documentation         |
| **Refactoring**     | Safe refactoring across codebase     |
| **Maintainability** | Easier to understand and modify code |

---

## Configuration

### tsconfig.json

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/store/*": ["./store/*"],
      "@/lib/*": ["./src/lib/*"]
    }
  },
  "include": ["**/*.ts", "**/*.tsx", ".expo/types/**/*.ts", "expo-env.d.ts"]
}
```

---

## Common Types

### Product Types

```typescript
// types/product.ts
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  stock: number;
  category: Category;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
```

### User Types

```typescript
// types/user.ts
export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
  addresses: Address[];
}

export interface Address {
  id: string;
  label: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}
```

### Order Types

```typescript
// types/order.ts
export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export interface Order {
  id: string;
  orderNumber: string;
  items: OrderItem[];
  status: OrderStatus;
  total: number;
  shippingAddress: Address;
  createdAt: string;
}

export interface OrderItem {
  product: Product;
  quantity: number;
  price: number;
}
```

---

## Component Props

```typescript
// Typed component props
interface ProductCardProps {
  product: Product;
  onPress?: () => void;
  showAddToCart?: boolean;
}

function ProductCard({ product, onPress, showAddToCart = true }: ProductCardProps) {
  // Component implementation
}

// With children
interface ScreenProps {
  children: React.ReactNode;
  title?: string;
}

// Event handlers
interface ButtonProps {
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
}
```

---

## Hooks Typing

```typescript
// Typed useState
const [count, setCount] = useState<number>(0);
const [user, setUser] = useState<User | null>(null);
const [items, setItems] = useState<CartItem[]>([]);

// Typed useRef
const inputRef = useRef<TextInput>(null);
const scrollRef = useRef<ScrollView>(null);

// Typed custom hook
function useProduct(id: string): {
  product: Product | null;
  loading: boolean;
  error: Error | null;
} {
  // Implementation
}
```

---

## API Types

```typescript
// GraphQL query response
interface ProductsResponse {
  products: {
    products: Product[];
    total: number;
    page: number;
    totalPages: number;
  };
}

// Mutation input
interface CreateOrderInput {
  items: Array<{
    productId: string;
    quantity: number;
  }>;
  shippingAddressId: string;
  paymentMethod: 'card' | 'paypal' | 'cod';
}
```

---

## Related Documentation

- [React Native](REACT_NATIVE.md) - React Native patterns
- [Apollo Client](APOLLO_CLIENT.md) - GraphQL typing
- [Zustand](ZUSTAND.md) - Store typing
