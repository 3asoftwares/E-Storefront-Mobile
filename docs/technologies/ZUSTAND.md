# Zustand

## Overview

**Version:** 4.5.2  
**Website:** [https://zustand-demo.pmnd.rs](https://zustand-demo.pmnd.rs)  
**Category:** Client State Management

Zustand is a small, fast, and scalable state management solution for React and React Native.

---

## Why Zustand?

### Benefits

| Benefit              | Description                                   |
| -------------------- | --------------------------------------------- |
| **Minimal API**      | Simple `create` function, no providers needed |
| **No Boilerplate**   | No reducers, actions, or dispatch             |
| **TypeScript Ready** | Full TypeScript support                       |
| **Tiny Bundle**      | ~1KB gzipped                                  |
| **React Native**     | Works seamlessly with React Native            |
| **Persistence**      | Easy AsyncStorage integration                 |

---

## Stores

### Cart Store

```typescript
// store/cartStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.id === item.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
              ),
            };
          }
          return { items: [...state.items, item] };
        }),

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        })),

      updateQuantity: (id, quantity) =>
        set((state) => ({
          items:
            quantity > 0
              ? state.items.map((i) => (i.id === id ? { ...i, quantity } : i))
              : state.items.filter((i) => i.id !== id),
        })),

      clearCart: () => set({ items: [] }),

      getTotalItems: () => get().items.reduce((total, item) => total + item.quantity, 0),

      getTotalPrice: () =>
        get().items.reduce((total, item) => total + item.price * item.quantity, 0),
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
```

### Auth Store

```typescript
// store/authStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
        }),

      logout: async () => {
        await SecureStore.deleteItemAsync('auth_token');
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ user: state.user }),
    }
  )
);
```

---

## Usage in Components

```tsx
import { useCartStore } from '@/store/cartStore';

// Selective subscription (recommended)
function CartBadge() {
  const itemCount = useCartStore((state) => state.getTotalItems());
  return <Text>{itemCount}</Text>;
}

// Multiple values
function CartScreen() {
  const { items, removeItem, getTotalPrice } = useCartStore();

  return (
    <View>
      <FlatList
        data={items}
        renderItem={({ item }) => <CartItem item={item} onRemove={() => removeItem(item.id)} />}
      />
      <Text>Total: ${getTotalPrice().toFixed(2)}</Text>
    </View>
  );
}

// Add item
function AddToCartButton({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem);

  return (
    <TouchableOpacity
      onPress={() =>
        addItem({
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          image: product.images[0],
        })
      }
    >
      <Text>Add to Cart</Text>
    </TouchableOpacity>
  );
}
```

---

## Related Documentation

- [Async Storage](ASYNC_STORAGE.md) - Persistent storage
- [React Query](REACT_QUERY.md) - Server state
- [TypeScript](TYPESCRIPT.md) - Type safety
