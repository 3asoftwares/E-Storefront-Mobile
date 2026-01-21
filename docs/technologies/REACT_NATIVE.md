# React Native

## Overview

**Version:** 0.74.5  
**Website:** [https://reactnative.dev](https://reactnative.dev)  
**Category:** Cross-Platform Mobile Framework

React Native is an open-source framework for building native mobile applications using JavaScript and React.

---

## Why React Native?

### Benefits

| Benefit             | Description                               |
| ------------------- | ----------------------------------------- |
| **Cross-Platform**  | Single codebase for iOS, Android, and Web |
| **Native UI**       | Real native components, not web views     |
| **Hot Reload**      | Fast refresh for rapid development        |
| **Large Ecosystem** | Thousands of community packages           |
| **Code Sharing**    | Share business logic with web apps        |
| **Performance**     | Near-native performance with JSI          |

### Why We Chose React Native

1. **Cross-Platform** - Build once, deploy everywhere
2. **React Skills** - Leverage existing React knowledge
3. **Expo Integration** - Simplified development workflow
4. **Native Performance** - No compromise on speed
5. **Hot Reloading** - Faster development cycles

---

## Core Concepts

### Native Components

```tsx
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';

function ProductCard({ product }: { product: Product }) {
  return (
    <TouchableOpacity style={styles.card}>
      <Image source={{ uri: product.image }} style={styles.image} resizeMode="cover" />
      <View style={styles.content}>
        <Text style={styles.title}>{product.name}</Text>
        <Text style={styles.price}>${product.price}</Text>
      </View>
    </TouchableOpacity>
  );
}
```

### StyleSheet

```tsx
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Android shadow
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3b82f6',
    marginTop: 8,
  },
});
```

### Lists

```tsx
import { FlatList, RefreshControl } from 'react-native';

function ProductList({ products, onRefresh, refreshing }) {
  return (
    <FlatList
      data={products}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <ProductCard product={item} />}
      numColumns={2}
      columnWrapperStyle={styles.row}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#3b82f6']} />
      }
      ListEmptyComponent={<EmptyState message="No products found" />}
    />
  );
}
```

### Platform-Specific Code

```tsx
import { Platform } from 'react-native';

const styles = StyleSheet.create({
  shadow: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    android: {
      elevation: 4,
    },
  }),
});

// Platform-specific components
const HapticButton =
  Platform.OS === 'ios'
    ? require('./HapticButtonIOS').default
    : require('./HapticButtonAndroid').default;
```

---

## Common Patterns

### Safe Area

```tsx
import { SafeAreaView } from 'react-native-safe-area-context';

function Screen({ children }: { children: React.ReactNode }) {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {children}
    </SafeAreaView>
  );
}
```

### Keyboard Handling

```tsx
import { KeyboardAvoidingView, Platform } from 'react-native';

function FormScreen() {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <TextInput placeholder="Email" />
      <TextInput placeholder="Password" secureTextEntry />
      <Button title="Login" onPress={handleLogin} />
    </KeyboardAvoidingView>
  );
}
```

### Loading States

```tsx
import { ActivityIndicator, View } from 'react-native';

function LoadingScreen() {
  return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color="#3b82f6" />
    </View>
  );
}
```

---

## Related Documentation

- [Expo](EXPO.md) - Expo platform
- [Expo Router](EXPO_ROUTER.md) - Navigation
- [Styling](STYLING.md) - Styling patterns
- [Components](COMPONENTS.md) - UI components
