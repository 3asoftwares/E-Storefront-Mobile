import React from 'react';
import { render } from '@testing-library/react-native';
import { Text } from 'react-native';
import { Badge, DotBadge } from '../../components/ui/Badge';

describe('Badge Component', () => {
    it('renders with text', () => {
        const { getByText } = render(<Badge text="New" />);
        expect(getByText('New')).toBeTruthy();
    });

    describe('Variants', () => {
        it('renders default variant', () => {
            const { getByText } = render(<Badge text="Default" variant="default" />);
            expect(getByText('Default')).toBeTruthy();
        });

        it('renders primary variant', () => {
            const { getByText } = render(<Badge text="Primary" variant="primary" />);
            expect(getByText('Primary')).toBeTruthy();
        });

        it('renders success variant', () => {
            const { getByText } = render(<Badge text="Success" variant="success" />);
            expect(getByText('Success')).toBeTruthy();
        });

        it('renders warning variant', () => {
            const { getByText } = render(<Badge text="Warning" variant="warning" />);
            expect(getByText('Warning')).toBeTruthy();
        });

        it('renders error variant', () => {
            const { getByText } = render(<Badge text="Error" variant="error" />);
            expect(getByText('Error')).toBeTruthy();
        });

        it('renders info variant', () => {
            const { getByText } = render(<Badge text="Info" variant="info" />);
            expect(getByText('Info')).toBeTruthy();
        });

        it('renders secondary variant', () => {
            const { getByText } = render(<Badge text="Secondary" variant="secondary" />);
            expect(getByText('Secondary')).toBeTruthy();
        });
    });

    describe('Sizes', () => {
        it('renders small size', () => {
            const { getByText } = render(<Badge text="Small" size="sm" />);
            expect(getByText('Small')).toBeTruthy();
        });

        it('renders medium size (default)', () => {
            const { getByText } = render(<Badge text="Medium" size="md" />);
            expect(getByText('Medium')).toBeTruthy();
        });

        it('renders large size', () => {
            const { getByText } = render(<Badge text="Large" size="lg" />);
            expect(getByText('Large')).toBeTruthy();
        });
    });

    describe('Icon Support', () => {
        it('renders with icon', () => {
            const icon = <Text>🔥</Text>;
            const { getByText } = render(<Badge text="Hot" icon={icon} />);
            expect(getByText('Hot')).toBeTruthy();
            expect(getByText('🔥')).toBeTruthy();
        });

        it('renders without icon', () => {
            const { getByText } = render(<Badge text="No Icon" />);
            expect(getByText('No Icon')).toBeTruthy();
        });
    });

    describe('Custom Styles', () => {
        it('applies custom style', () => {
            const customStyle = { marginTop: 10 };
            const { getByText } = render(<Badge text="Styled" style={customStyle} />);
            expect(getByText('Styled')).toBeTruthy();
        });
    });

    describe('Combined Props', () => {
        it('renders with multiple props', () => {
            const icon = <Text>✓</Text>;
            const { getByText } = render(
                <Badge text="Complete" variant="success" size="lg" icon={icon} />
            );
            expect(getByText('Complete')).toBeTruthy();
            expect(getByText('✓')).toBeTruthy();
        });
    });
});

describe('DotBadge Component', () => {
    it('renders with count', () => {
        const { getByText } = render(<DotBadge count={5} />);
        expect(getByText('5')).toBeTruthy();
    });

    it('does not render when count is 0 and showZero is false', () => {
        const { queryByText } = render(<DotBadge count={0} showZero={false} />);
        expect(queryByText('0')).toBeNull();
    });

    it('renders when count is 0 and showZero is true', () => {
        const { getByText } = render(<DotBadge count={0} showZero={true} />);
        expect(getByText('0')).toBeTruthy();
    });

    it('does not render when count is undefined and showZero is false', () => {
        const { toJSON } = render(<DotBadge showZero={false} />);
        expect(toJSON()).toBeNull();
    });

    it('displays max+ when count exceeds max', () => {
        const { getByText } = render(<DotBadge count={100} max={99} />);
        expect(getByText('99+')).toBeTruthy();
    });

    it('displays exact count when within max', () => {
        const { getByText } = render(<DotBadge count={50} max={99} />);
        expect(getByText('50')).toBeTruthy();
    });

    it('uses default max of 99', () => {
        const { getByText } = render(<DotBadge count={150} />);
        expect(getByText('99+')).toBeTruthy();
    });

    it('applies custom style', () => {
        const customStyle = { backgroundColor: '#FF0000' };
        const { getByText } = render(<DotBadge count={3} style={customStyle} />);
        expect(getByText('3')).toBeTruthy();
    });

    it('renders without count when count is undefined but showZero is true', () => {
        const { toJSON } = render(<DotBadge showZero={true} />);
        // When showZero is true but count is undefined, it still renders but with no text
        expect(toJSON()).toBeTruthy();
    });
});
