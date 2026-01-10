import React, { memo, useCallback, useMemo } from 'react';
import { FlatList, FlatListProps, ViewToken } from 'react-native';

interface OptimizedListProps<T> extends Omit<FlatListProps<T>, 'renderItem'> {
  data: T[];
  renderItem: (item: T, index: number) => React.ReactElement;
  keyExtractor: (item: T, index: number) => string;
  itemHeight?: number; // For getItemLayout optimization
  onViewableItemsChanged?: (items: T[]) => void;
}

/**
 * Optimized FlatList with performance best practices:
 * - getItemLayout for fixed height items
 * - windowSize for memory optimization
 * - removeClippedSubviews for off-screen recycling
 * - maxToRenderPerBatch for render batching
 */
function OptimizedListComponent<T>({
  data,
  renderItem,
  keyExtractor,
  itemHeight,
  onViewableItemsChanged,
  ...props
}: OptimizedListProps<T>) {
  // Memoized render function
  const memoizedRenderItem = useCallback(
    ({ item, index }: { item: T; index: number }) => renderItem(item, index),
    [renderItem]
  );

  // Fixed item layout for performance (if height is known)
  const getItemLayout = useMemo(() => {
    if (!itemHeight) return undefined;
    return (_: T[] | null | undefined, index: number) => ({
      length: itemHeight,
      offset: itemHeight * index,
      index,
    });
  }, [itemHeight]);

  // Viewability config
  const viewabilityConfig = useMemo(
    () => ({
      itemVisiblePercentThreshold: 50,
      minimumViewTime: 300,
    }),
    []
  );

  // Handle viewable items change
  const handleViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (onViewableItemsChanged) {
        const items = viewableItems
          .filter(token => token.isViewable && token.item)
          .map(token => token.item as T);
        onViewableItemsChanged(items);
      }
    },
    [onViewableItemsChanged]
  );

  return (
    <FlatList
      data={data}
      renderItem={memoizedRenderItem}
      keyExtractor={keyExtractor}
      getItemLayout={getItemLayout}
      // Performance optimizations
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      updateCellsBatchingPeriod={50}
      windowSize={5}
      initialNumToRender={10}
      // Viewability tracking
      viewabilityConfig={viewabilityConfig}
      onViewableItemsChanged={handleViewableItemsChanged}
      // Other props
      showsVerticalScrollIndicator={false}
      {...props}
    />
  );
}

export const OptimizedList = memo(OptimizedListComponent) as typeof OptimizedListComponent;

/**
 * Hook for list item optimization
 * Use this to memoize list item props
 */
export function useListItemOptimization<T extends Record<string, any>>(
  item: T,
  deps: any[] = []
): T {
  return useMemo(() => item, [item.id, ...deps]);
}

/**
 * Debounced scroll handler for performance
 */
export function useDebouncedScroll(callback: () => void, delay: number = 100) {
  const timeoutRef = React.useRef<NodeJS.Timeout>();

  return useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(callback, delay);
  }, [callback, delay]);
}
