import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import RequireRole from '../RequireRole';
import { useAuth } from '@/context/AuthContext';

// Mock the useAuth hook
vi.mock('@/context/AuthContext', () => ({
    useAuth: vi.fn(),
}));

describe('RequireRole Component', () => {
    it('renders children when user has the required role', () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (useAuth as any).mockReturnValue({
            hasRole: () => true,
            isLoading: false,
        });

        render(
            <RequireRole role="ADMIN">
                <div data-testid="protected-content">Protected Content</div>
            </RequireRole>
        );

        expect(screen.getByTestId('protected-content')).toBeInTheDocument();
        expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });

    it('does not render children when user lacks the required role', () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (useAuth as any).mockReturnValue({
            hasRole: () => false,
            isLoading: false,
        });

        render(
            <RequireRole role="ADMIN">
                <div data-testid="protected-content">Protected Content</div>
            </RequireRole>
        );

        expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    });

    it('renders fallback when user lacks the required role', () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (useAuth as any).mockReturnValue({
            hasRole: () => false,
            isLoading: false,
        });

        render(
            <RequireRole role="ADMIN" fallback={<div data-testid="fallback">Fallback Content</div>}>
                <div data-testid="protected-content">Protected Content</div>
            </RequireRole>
        );

        expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
        expect(screen.getByTestId('fallback')).toBeInTheDocument();
    });

    it('renders nothing while loading', () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (useAuth as any).mockReturnValue({
            hasRole: () => true, // Even if they have the role
            isLoading: true,
        });

        render(
            <RequireRole role="ADMIN">
                <div data-testid="protected-content">Protected Content</div>
            </RequireRole>
        );

        expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    });
});
