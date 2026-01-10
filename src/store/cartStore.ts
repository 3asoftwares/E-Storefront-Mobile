import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface CartItem {
    id: string;
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
    variant?: string;
}

export interface WishlistItem {
    id?: string; // Alias for productId for compatibility
    productId: string;
    name: string;
    price: number;
    image?: string;
    addedAt: number;
}

export interface RecentlyViewedItem {
    id?: string; // Alias for productId for compatibility
    productId: string;
    name: string;
    price: number;
    image?: string;
    viewedAt: number;
}

export interface UserProfile {
    id: string;
    email: string;
    name: string;
    phone?: string;
    addresses?: any[];
    defaultAddressId?: string;
}

export interface Address {
    id: string;
    label: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    isDefault?: boolean;
}

interface CartStore {
    items: CartItem[];
    cart: CartItem[]; // Alias for items
    wishlist: WishlistItem[];
    recentlyViewed: RecentlyViewedItem[];
    recentSearches: string[];
    userProfile: UserProfile | null;

    // Cart actions
    addItem: (item: CartItem) => void;
    addToCart: (item: Omit<CartItem, 'id'> & { variant?: string }) => void;
    removeItem: (id: string) => void;
    removeFromCart: (productId: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    getTotalItems: () => number;
    getTotalPrice: () => number;

    // Wishlist actions
    addToWishlist: (item: Omit<WishlistItem, 'addedAt'>) => void;
    removeFromWishlist: (productId: string) => void;
    toggleWishlistItem: (item: { id: string; name: string; price: number; image?: string }) => void;
    clearWishlist: () => void;
    isInWishlist: (productId: string) => boolean;

    // Recently viewed actions
    addRecentlyViewed: (item: Omit<RecentlyViewedItem, 'viewedAt'>) => void;
    addToRecentlyViewed: (item: { id: string; name: string; price: number; image?: string }) => void;
    clearRecentlyViewed: () => void;

    // Recent searches
    addRecentSearch: (query: string) => void;
    clearRecentSearches: () => void;

    // User actions
    setUserProfile: (profile: UserProfile | null) => void;
    loadUserFromStorage: () => void;
    clearUser: () => void;

    // Address actions
    addAddress: (address: Address) => void;
    updateAddress: (id: string, address: Partial<Address>) => void;
    removeAddress: (id: string) => void;
    setDefaultAddress: (id: string) => void;
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            get cart() {
                return get().items;
            },
            wishlist: [],
            recentlyViewed: [],
            recentSearches: [],
            userProfile: null,

            // Cart actions
            addItem: (item) =>
                set((state) => {
                    const existingItem = state.items.find((i) => i.id === item.id);
                    if (existingItem) {
                        return {
                            items: state.items.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i)),
                        };
                    }
                    return { items: [...state.items, item] };
                }),

            addToCart: (item) =>
                set((state) => {
                    const itemId = item.productId + (item.variant || '');
                    const existingItem = state.items.find((i) => i.id === itemId || i.productId === item.productId);
                    if (existingItem) {
                        return {
                            items: state.items.map((i) =>
                                i.id === itemId || i.productId === item.productId ? { ...i, quantity: i.quantity + (item.quantity || 1) } : i
                            ),
                        };
                    }
                    return {
                        items: [
                            ...state.items,
                            {
                                ...item,
                                id: itemId,
                                quantity: item.quantity || 1,
                            },
                        ],
                    };
                }),

            removeItem: (id) =>
                set((state) => ({
                    items: state.items.filter((item) => item.id !== id),
                })),

            removeFromCart: (productId) =>
                set((state) => ({
                    items: state.items.filter((item) => item.productId !== productId),
                })),

            updateQuantity: (id, quantity) =>
                set((state) => ({
                    items:
                        quantity > 0
                            ? state.items.map((item) => (item.id === id || item.productId === id ? { ...item, quantity } : item))
                            : state.items.filter((item) => item.id !== id && item.productId !== id),
                })),

            clearCart: () => set({ items: [] }),

            getTotalItems: () => {
                return get().items.reduce((total, item) => total + item.quantity, 0);
            },

            getTotalPrice: () => {
                return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
            },

            // Wishlist actions
            addToWishlist: (item) =>
                set((state) => {
                    const itemProductId = item.productId || item.id || '';
                    const exists = state.wishlist.find((w) => w.productId === itemProductId || w.id === itemProductId);
                    if (exists) return state;
                    const newItem: WishlistItem = {
                        productId: itemProductId,
                        name: item.name,
                        price: item.price,
                        image: item.image,
                        addedAt: Date.now(),
                    };
                    return {
                        wishlist: [...state.wishlist, newItem],
                    };
                }),

            removeFromWishlist: (productId) =>
                set((state) => ({
                    wishlist: state.wishlist.filter((w) => w.productId !== productId && w.id !== productId),
                })),

            toggleWishlistItem: (item) =>
                set((state) => {
                    const itemId = item.id || '';
                    const exists = state.wishlist.find((w) => w.productId === itemId);
                    if (exists) {
                        return {
                            wishlist: state.wishlist.filter((w) => w.productId !== itemId),
                        };
                    }
                    return {
                        wishlist: [
                            ...state.wishlist,
                            {
                                productId: itemId,
                                name: item.name,
                                price: item.price,
                                image: item.image,
                                addedAt: Date.now(),
                            },
                        ],
                    };
                }),

            clearWishlist: () => set({ wishlist: [] }),

            isInWishlist: (productId) => {
                return get().wishlist.some((w) => w.productId === productId);
            },

            // Recently viewed actions
            addRecentlyViewed: (item) => {
                const { recentlyViewed } = get();
                const filtered = recentlyViewed.filter((i) => i.productId !== item.productId);
                set({ recentlyViewed: [{ ...item, viewedAt: Date.now() }, ...filtered].slice(0, 12) });
            },

            addToRecentlyViewed: (item) => {
                const { recentlyViewed } = get();
                const filtered = recentlyViewed.filter((i) => i.productId !== item.id);
                set({
                    recentlyViewed: [
                        {
                            productId: item.id,
                            name: item.name,
                            price: item.price,
                            image: item.image,
                            viewedAt: Date.now(),
                        },
                        ...filtered,
                    ].slice(0, 12),
                });
            },

            clearRecentlyViewed: () => set({ recentlyViewed: [] }),

            // Recent searches
            addRecentSearch: (query) => {
                const { recentSearches } = get();
                const filtered = recentSearches.filter((s) => s.toLowerCase() !== query.toLowerCase());
                set({ recentSearches: [query, ...filtered].slice(0, 20) });
            },

            clearRecentSearches: () => set({ recentSearches: [] }),

            // User actions
            setUserProfile: (profile) => set({ userProfile: profile }),

            loadUserFromStorage: async () => {
                try {
                    const userJson = await AsyncStorage.getItem('user');
                    if (userJson) {
                        const user = JSON.parse(userJson);
                        set({
                            userProfile: {
                                id: user.id,
                                email: user.email,
                                name: user.name || user.email.split('@')[0],
                                addresses: user.addresses || [],
                                defaultAddressId: user.defaultAddressId,
                                phone: user.phone,
                            },
                        });
                    }
                } catch (error) {
                    console.error('Error loading user from storage:', error);
                }
            },

            clearUser: () => set({ userProfile: null }),

            // Address actions
            addAddress: (address) =>
                set((state) => {
                    if (!state.userProfile) return state;
                    const addresses = state.userProfile.addresses || [];
                    return {
                        userProfile: {
                            ...state.userProfile,
                            addresses: [...addresses, address],
                        },
                    };
                }),

            updateAddress: (id, updates) =>
                set((state) => {
                    if (!state.userProfile) return state;
                    const addresses = (state.userProfile.addresses || []).map((addr: Address) => (addr.id === id ? { ...addr, ...updates } : addr));
                    return {
                        userProfile: {
                            ...state.userProfile,
                            addresses,
                        },
                    };
                }),

            removeAddress: (id) =>
                set((state) => {
                    if (!state.userProfile) return state;
                    const addresses = (state.userProfile.addresses || []).filter((addr: Address) => addr.id !== id);
                    return {
                        userProfile: {
                            ...state.userProfile,
                            addresses,
                        },
                    };
                }),

            setDefaultAddress: (id) =>
                set((state) => {
                    if (!state.userProfile) return state;
                    return {
                        userProfile: {
                            ...state.userProfile,
                            defaultAddressId: id,
                        },
                    };
                }),
        }),
        {
            name: 'cart-storage',
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state) => ({
                items: state.items,
                wishlist: state.wishlist,
                recentlyViewed: state.recentlyViewed,
                recentSearches: state.recentSearches,
            }),
        }
    )
);
