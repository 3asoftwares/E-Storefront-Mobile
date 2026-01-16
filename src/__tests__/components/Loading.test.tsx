import React from 'react';
import { render } from '@testing-library/react-native';
import { Loading, Skeleton, ProductCardSkeleton, ListSkeleton } from '../../components/ui/Loading';

describe('Loading Component', () => {
    it('should render loading indicator', () => {
        const { UNSAFE_getByType } = render(<Loading />);
        const ActivityIndicator = require('react-native').ActivityIndicator;
        expect(UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
    });

    it('should render with text', () => {
        const { getByText } = render(<Loading text="Loading..." />);
        expect(getByText('Loading...')).toBeTruthy();
    });

    it('should render in fullScreen mode', () => {
        const { UNSAFE_getByType } = render(<Loading fullScreen />);
        const ActivityIndicator = require('react-native').ActivityIndicator;
        expect(UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
    });
});

describe('Skeleton Component', () => {
    it('should render skeleton', () => {
        const { toJSON } = render(<Skeleton />);
        expect(toJSON()).toBeTruthy();
    });

    it('should render with custom dimensions', () => {
        const { toJSON } = render(<Skeleton width={200} height={40} />);
        expect(toJSON()).toBeTruthy();
    });
});

describe('ProductCardSkeleton Component', () => {
    it('should render product card skeleton', () => {
        const { toJSON } = render(<ProductCardSkeleton />);
        expect(toJSON()).toBeTruthy();
    });
});

describe('ListSkeleton Component', () => {
    it('should render list skeleton with default count', () => {
        const { toJSON } = render(<ListSkeleton />);
        expect(toJSON()).toBeTruthy();
    });

    it('should render list skeleton with custom count', () => {
        const { toJSON } = render(<ListSkeleton count={3} itemHeight={80} />);
        expect(toJSON()).toBeTruthy();
    });
});
