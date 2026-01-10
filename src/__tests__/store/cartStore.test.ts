import { useCartStore } from '../../store/cartStore';

// Reset store before each test
beforeEach(() => {
  useCartStore.setState({ items: [], total: 0 });
});

describe('Cart Store', () => {
  it('should start with empty cart', () => {
    const state = useCartStore.getState();
    expect(state.items).toEqual([]);
  });

  it('should add item to cart', () => {
    const { addItem } = useCartStore.getState();
    
    addItem?.({
      id: '1',
      name: 'Test Product',
      price: 29.99,
      quantity: 1,
      image: 'test.jpg',
    });

    const state = useCartStore.getState();
    expect(state.items.length).toBe(1);
    expect(state.items[0].name).toBe('Test Product');
  });

  it('should update quantity when adding same item', () => {
    const { addItem } = useCartStore.getState();
    
    addItem?.({
      id: '1',
      name: 'Test Product',
      price: 29.99,
      quantity: 1,
      image: 'test.jpg',
    });

    addItem?.({
      id: '1',
      name: 'Test Product',
      price: 29.99,
      quantity: 2,
      image: 'test.jpg',
    });

    const state = useCartStore.getState();
    expect(state.items.length).toBe(1);
    expect(state.items[0].quantity).toBeGreaterThan(1);
  });

  it('should remove item from cart', () => {
    const { addItem, removeItem } = useCartStore.getState();
    
    addItem?.({
      id: '1',
      name: 'Test Product',
      price: 29.99,
      quantity: 1,
      image: 'test.jpg',
    });

    removeItem?.('1');

    const state = useCartStore.getState();
    expect(state.items.length).toBe(0);
  });

  it('should clear cart', () => {
    const { addItem, clearCart } = useCartStore.getState();
    
    addItem?.({
      id: '1',
      name: 'Product 1',
      price: 29.99,
      quantity: 1,
      image: 'test1.jpg',
    });

    addItem?.({
      id: '2',
      name: 'Product 2',
      price: 19.99,
      quantity: 1,
      image: 'test2.jpg',
    });

    clearCart?.();

    const state = useCartStore.getState();
    expect(state.items.length).toBe(0);
  });
});
