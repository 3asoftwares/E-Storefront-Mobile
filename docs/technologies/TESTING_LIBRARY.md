# React Native Testing Library

## Overview

**Version:** 12.4.3  
**Website:** [https://callstack.github.io/react-native-testing-library](https://callstack.github.io/react-native-testing-library)  
**Category:** Component Testing

React Native Testing Library provides utilities to test React Native components focusing on user behavior.

---

## Why React Native Testing Library?

### Benefits

| Benefit              | Description                                  |
| -------------------- | -------------------------------------------- |
| **User-Centric**     | Test how users interact with components      |
| **Simple API**       | Easy-to-use queries and matchers             |
| **Best Practices**   | Encourages accessible and maintainable tests |
| **Jest Integration** | Works seamlessly with Jest                   |

---

## Core API

### Render

```tsx
import { render } from '@testing-library/react-native';

const { getByText, getByTestId, queryByText } = render(<ProductCard product={mockProduct} />);
```

### Queries

```tsx
// Get by text (throws if not found)
const title = screen.getByText('Product Name');

// Query by text (returns null if not found)
const badge = screen.queryByText('Sale');

// Get by testID
const button = screen.getByTestId('add-to-cart-btn');

// Get all matching
const items = screen.getAllByText(/item/i);

// Find (async, waits for element)
const loadedItem = await screen.findByText('Loaded');
```

### User Events

```tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';

// Press event
fireEvent.press(screen.getByText('Add to Cart'));

// Text input
fireEvent.changeText(screen.getByPlaceholderText('Search'), 'shoes');

// Scroll
fireEvent.scroll(screen.getByTestId('product-list'), {
  nativeEvent: { contentOffset: { y: 500 } },
});
```

---

## Examples

### Testing a Button

```tsx
import { render, screen, fireEvent } from '@testing-library/react-native';
import { AddToCartButton } from '@/components/AddToCartButton';

describe('AddToCartButton', () => {
  it('shows loading state when pressed', async () => {
    const onAdd = jest.fn();
    render(<AddToCartButton onAdd={onAdd} />);

    const button = screen.getByText('Add to Cart');
    fireEvent.press(button);

    expect(onAdd).toHaveBeenCalled();
  });

  it('is disabled when out of stock', () => {
    render(<AddToCartButton disabled />);

    const button = screen.getByText('Out of Stock');
    expect(button).toBeDisabled();
  });
});
```

### Testing Form Input

```tsx
import { render, screen, fireEvent } from '@testing-library/react-native';
import { SearchBar } from '@/components/SearchBar';

describe('SearchBar', () => {
  it('calls onSearch with input value', () => {
    const onSearch = jest.fn();
    render(<SearchBar onSearch={onSearch} />);

    const input = screen.getByPlaceholderText('Search products...');
    fireEvent.changeText(input, 'shoes');
    fireEvent.submitEditing(input);

    expect(onSearch).toHaveBeenCalledWith('shoes');
  });
});
```

### Testing Async Behavior

```tsx
import { render, screen, waitFor } from '@testing-library/react-native';
import { ProductList } from '@/components/ProductList';

jest.mock('@/hooks/useProducts', () => ({
  useProducts: () => ({
    data: [{ id: '1', name: 'Product 1' }],
    isLoading: false,
  }),
}));

describe('ProductList', () => {
  it('displays products after loading', async () => {
    render(<ProductList />);

    await waitFor(() => {
      expect(screen.getByText('Product 1')).toBeTruthy();
    });
  });
});
```

---

## Related Documentation

- [Jest](JEST.md) - Test framework
- [Cypress](CYPRESS.md) - E2E testing
