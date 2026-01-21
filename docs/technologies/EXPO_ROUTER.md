# Expo Router

## Overview

**Version:** 3.5.23  
**Website:** [https://expo.github.io/router](https://expo.github.io/router)  
**Category:** Navigation Library

Expo Router is a file-based router for React Native and web applications, bringing Next.js-style routing to Expo.

---

## Why Expo Router?

### Benefits

| Benefit            | Description                               |
| ------------------ | ----------------------------------------- |
| **File-Based**     | Routes defined by file structure          |
| **Universal**      | Same routes work on iOS, Android, and Web |
| **Deep Linking**   | Automatic deep link configuration         |
| **Type-Safe**      | Full TypeScript support with typed routes |
| **SEO Ready**      | Web optimizations for search engines      |
| **Nested Layouts** | Shared layouts for route groups           |

---

## Project Structure

### File-Based Routes

```
app/
├── _layout.tsx              # Root layout (providers, auth)
├── index.tsx                # Home screen (/)
├── (tabs)/                  # Tab navigator group
│   ├── _layout.tsx          # Tab bar configuration
│   ├── index.tsx            # Home tab (/)
│   ├── categories.tsx       # Categories tab (/categories)
│   ├── cart.tsx             # Cart tab (/cart)
│   └── profile.tsx          # Profile tab (/profile)
├── product/
│   ├── index.tsx            # Product list (/product)
│   └── [id].tsx             # Product detail (/product/123)
├── orders/
│   ├── index.tsx            # Orders list (/orders)
│   └── [id].tsx             # Order detail (/orders/456)
├── login.tsx                # Login (/login)
├── signup.tsx               # Signup (/signup)
├── checkout.tsx             # Checkout (/checkout)
├── settings.tsx             # Settings (/settings)
└── +not-found.tsx           # 404 page
```

---

## Layouts

### Root Layout

```tsx
// app/_layout.tsx
import { Stack } from 'expo-router';
import { QueryClientProvider } from '@tanstack/react-query';
import { ApolloProvider } from '@apollo/client';

export default function RootLayout() {
  return (
    <ApolloProvider client={apolloClient}>
      <QueryClientProvider client={queryClient}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="login" options={{ presentation: 'modal' }} />
          <Stack.Screen name="product/[id]" />
        </Stack>
      </QueryClientProvider>
    </ApolloProvider>
  );
}
```

### Tab Layout

```tsx
// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHome, faList, faShoppingCart, faUser } from '@fortawesome/free-solid-svg-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#3b82f6',
        tabBarInactiveTintColor: '#9ca3af',
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <FontAwesomeIcon icon={faHome} color={color} size={20} />,
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          title: 'Categories',
          tabBarIcon: ({ color }) => <FontAwesomeIcon icon={faList} color={color} size={20} />,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
          tabBarIcon: ({ color }) => (
            <FontAwesomeIcon icon={faShoppingCart} color={color} size={20} />
          ),
          tabBarBadge: cartItemCount || undefined,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <FontAwesomeIcon icon={faUser} color={color} size={20} />,
        }}
      />
    </Tabs>
  );
}
```

---

## Navigation

### Link Component

```tsx
import { Link } from 'expo-router';

// Simple link
<Link href="/categories">View Categories</Link>

// Link with params
<Link href={`/product/${product.id}`}>
  <ProductCard product={product} />
</Link>

// Push (add to stack)
<Link href="/checkout" push>
  Proceed to Checkout
</Link>

// Replace (no back button)
<Link href="/login" replace>
  Login
</Link>
```

### useRouter Hook

```tsx
import { useRouter } from 'expo-router';

function CheckoutButton() {
  const router = useRouter();

  const handleCheckout = () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    router.push('/checkout');
  };

  return <Button onPress={handleCheckout}>Checkout</Button>;
}

// Navigation methods
router.push('/product/123'); // Add to stack
router.replace('/home'); // Replace current
router.back(); // Go back
router.canGoBack(); // Check if can go back
router.setParams({ id: '456' }); // Update params
```

### Dynamic Routes

```tsx
// app/product/[id].tsx
import { useLocalSearchParams } from 'expo-router';

export default function ProductScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data: product, loading } = useQuery(GET_PRODUCT, {
    variables: { id },
  });

  if (loading) return <Loading />;

  return (
    <View>
      <Text>{product.name}</Text>
      <Text>${product.price}</Text>
    </View>
  );
}
```

---

## Route Groups

### Authentication Flow

```
app/
├── (auth)/                  # Auth routes (modal presentation)
│   ├── _layout.tsx
│   ├── login.tsx
│   ├── signup.tsx
│   └── forgot-password.tsx
├── (app)/                   # Main app routes
│   ├── _layout.tsx
│   ├── (tabs)/
│   │   └── ...
│   └── ...
```

```tsx
// app/(auth)/_layout.tsx
import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        presentation: 'modal',
        headerShown: true,
      }}
    />
  );
}
```

---

## Deep Linking

### Configuration

```json
// app.json
{
  "expo": {
    "scheme": "estorefront",
    "web": {
      "bundler": "metro"
    }
  }
}
```

### Deep Link URLs

| URL                                        | Route          |
| ------------------------------------------ | -------------- |
| `estorefront://`                           | Home           |
| `estorefront://product/123`                | Product detail |
| `estorefront://orders/456`                 | Order detail   |
| `https://shop.3asoftwares.com/product/123` | Universal link |

---

## Related Documentation

- [React Native](REACT_NATIVE.md) - React Native basics
- [Expo](EXPO.md) - Expo platform
- [TypeScript](TYPESCRIPT.md) - Type safety
