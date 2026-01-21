# Async Storage

## Overview

**Version:** 1.23.1  
**Website:** [https://react-native-async-storage.github.io/async-storage](https://react-native-async-storage.github.io/async-storage)  
**Category:** Local Storage

Async Storage is an asynchronous, unencrypted, persistent, key-value storage system for React Native.

---

## Why Async Storage?

### Benefits

| Benefit             | Description                                |
| ------------------- | ------------------------------------------ |
| **Cross-Platform**  | Works on iOS, Android, and Web             |
| **Persistent**      | Data survives app restarts                 |
| **Asynchronous**    | Non-blocking operations                    |
| **Simple API**      | Easy to use key-value interface            |
| **Zustand Support** | Integrates with Zustand persist middleware |

---

## Basic Usage

### Store Data

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

// Store string
await AsyncStorage.setItem('username', 'john_doe');

// Store object (must stringify)
const user = { id: '123', name: 'John' };
await AsyncStorage.setItem('user', JSON.stringify(user));
```

### Retrieve Data

```typescript
// Get string
const username = await AsyncStorage.getItem('username');

// Get object
const userJson = await AsyncStorage.getItem('user');
const user = userJson ? JSON.parse(userJson) : null;
```

### Remove Data

```typescript
// Remove single item
await AsyncStorage.removeItem('username');

// Remove multiple items
await AsyncStorage.multiRemove(['username', 'user']);

// Clear all data
await AsyncStorage.clear();
```

---

## With Zustand

```typescript
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SettingsStore {
  theme: 'light' | 'dark';
  notifications: boolean;
  setTheme: (theme: 'light' | 'dark') => void;
  toggleNotifications: () => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      theme: 'light',
      notifications: true,
      setTheme: (theme) => set({ theme }),
      toggleNotifications: () => set((state) => ({ notifications: !state.notifications })),
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
```

---

## Best Practices

### 1. Use for Non-Sensitive Data Only

```typescript
// ✅ Good - non-sensitive data
await AsyncStorage.setItem('onboarding_completed', 'true');
await AsyncStorage.setItem('cart', JSON.stringify(cartItems));

// ❌ Bad - sensitive data (use SecureStore instead)
await AsyncStorage.setItem('auth_token', token);
await AsyncStorage.setItem('password', password);
```

### 2. Handle Errors

```typescript
async function saveData(key: string, value: any) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error saving data:', error);
  }
}

async function loadData<T>(key: string): Promise<T | null> {
  try {
    const json = await AsyncStorage.getItem(key);
    return json ? JSON.parse(json) : null;
  } catch (error) {
    console.error('Error loading data:', error);
    return null;
  }
}
```

### 3. Use SecureStore for Tokens

```typescript
import * as SecureStore from 'expo-secure-store';

// Auth tokens - use SecureStore
await SecureStore.setItemAsync('auth_token', token);

// Cart data - use AsyncStorage
await AsyncStorage.setItem('cart', JSON.stringify(cart));
```

---

## Related Documentation

- [Zustand](ZUSTAND.md) - State management with persistence
- [Expo](EXPO.md) - SecureStore for sensitive data
