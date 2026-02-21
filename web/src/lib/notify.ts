/**
 * notify.ts — Centralized notification utility
 *
 * A thin wrapper around react-hot-toast that:
 *   - Provides typed, named helpers: success, error, info, warning, promise
 *   - Enforces consistent duration and dedup options
 *   - Acts as the single import for all toast calls across the app
 *
 * Usage:
 *   import { notify } from '@/lib/notify';
 *   notify.success('Profile updated!');
 *   notify.error('Request failed', { duration: 6000 });
 *   await notify.promise(fetchData(), { loading: '...', success: 'Done', error: 'Failed' });
 */

import toast, { type ToastOptions } from 'react-hot-toast';

const BASE_DURATION = 4000;

const defaultOpts: ToastOptions = {
    duration: BASE_DURATION,
};

export const notify = {
    /**
     * Green success toast — use for completed user actions.
     */
    success(message: string, opts?: ToastOptions) {
        return toast.success(message, { ...defaultOpts, ...opts });
    },

    /**
     * Red error toast — use for API failures or user input errors.
     * Default duration is longer (6 s) to give users time to read.
     */
    error(message: string, opts?: ToastOptions) {
        return toast.error(message, { duration: 6000, ...opts });
    },

    /**
     * Neutral info toast — use for background updates or non-critical notices.
     */
    info(message: string, opts?: ToastOptions) {
        return toast(message, {
            ...defaultOpts,
            icon: 'ℹ️',
            ...opts,
        });
    },

    /**
     * Yellow warning toast — use for recoverable issues or important notices.
     */
    warning(message: string, opts?: ToastOptions) {
        return toast(message, {
            ...defaultOpts,
            icon: '⚠️',
            style: { background: '#92400E', color: '#FEF3C7' },
            ...opts,
        });
    },

    /**
     * Promise toast — tracks a promise and shows loading → success/error.
     * Perfect for wrapping async operations.
     *
     * @example
     * await notify.promise(saveData(), {
     *   loading: 'Saving...',
     *   success: 'Saved successfully!',
     *   error: (err) => `Failed: ${err.message}`,
     * });
     */
    promise<T>(
        promise: Promise<T>,
        messages: {
            loading: string;
            success: string | ((data: T) => string);
            error: string | ((err: unknown) => string);
        },
        opts?: ToastOptions,
    ) {
        return toast.promise(promise, messages, { ...defaultOpts, ...opts });
    },

    /**
     * Dismiss a specific toast or all toasts.
     */
    dismiss(toastId?: string) {
        toast.dismiss(toastId);
    },
} as const;

export default notify;
