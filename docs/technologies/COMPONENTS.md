# Components

## Overview

E-Storefront Mobile UI component library and patterns.

---

## Component Structure

```
src/components/
├── common/
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Card.tsx
│   ├── Loading.tsx
│   └── ErrorMessage.tsx
├── product/
│   ├── ProductCard.tsx
│   ├── ProductList.tsx
│   ├── ProductImage.tsx
│   └── ProductPrice.tsx
├── cart/
│   ├── CartItem.tsx
│   ├── CartSummary.tsx
│   └── QuantityControl.tsx
├── navigation/
│   ├── Header.tsx
│   ├── TabBar.tsx
│   └── BackButton.tsx
└── auth/
    ├── LoginForm.tsx
    └── SignupForm.tsx
```

---

## Common Components

### Button

```tsx
interface ButtonProps {
  onPress: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  loading?: boolean;
  disabled?: boolean;
}

function Button({ onPress, children, variant = 'primary', loading, disabled }: ButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[styles.button, styles[variant], disabled && styles.disabled]}
    >
      {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.text}>{children}</Text>}
    </TouchableOpacity>
  );
}
```

### Input

```tsx
interface InputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  error?: string;
}

function Input({ value, onChangeText, placeholder, secureTextEntry, error }: InputProps) {
  return (
    <View style={styles.container}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        style={[styles.input, error && styles.inputError]}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}
```

### Card

```tsx
interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
}

function Card({ children, onPress }: CardProps) {
  const Container = onPress ? TouchableOpacity : View;
  return (
    <Container style={styles.card} onPress={onPress}>
      {children}
    </Container>
  );
}
```

---

## Product Components

### ProductCard

```tsx
interface ProductCardProps {
  product: Product;
  onPress: () => void;
}

function ProductCard({ product, onPress }: ProductCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={{ uri: product.images[0] }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>
        <Text style={styles.price}>${product.price.toFixed(2)}</Text>
        {product.stock === 0 && <Text style={styles.outOfStock}>Out of Stock</Text>}
      </View>
    </TouchableOpacity>
  );
}
```

### QuantityControl

```tsx
interface QuantityControlProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
}

function QuantityControl({ quantity, onIncrease, onDecrease }: QuantityControlProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onDecrease} style={styles.button}>
        <FontAwesomeIcon icon={faMinus} size={12} />
      </TouchableOpacity>
      <Text style={styles.quantity}>{quantity}</Text>
      <TouchableOpacity onPress={onIncrease} style={styles.button}>
        <FontAwesomeIcon icon={faPlus} size={12} />
      </TouchableOpacity>
    </View>
  );
}
```

---

## Related Documentation

- [React Native](REACT_NATIVE.md) - Native components
- [Styling](STYLING.md) - Styling patterns
- [FontAwesome](FONTAWESOME.md) - Icons
