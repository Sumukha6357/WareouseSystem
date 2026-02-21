/**
 * httpClient — typed fetch wrapper for the Warehouse Management API.
 *
 * Responsibilities:
 *  - Base URL from env or fall back to '/api' (Next.js proxy in dev)
 *  - credentials: 'include' for Spring-session cookies
 *  - Unwraps backend ResponseStructure<T> → returns T directly
 *  - Throws ApiError on any non-2xx response with a consistent shape
 */

import type { ApiResponse } from '@/types/api';

// ─── Error type ───────────────────────────────────────────────────────────────

export class ApiError extends Error {
    constructor(
        public readonly status: number,
        message: string,
        public readonly data?: unknown,
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

// ─── Config ───────────────────────────────────────────────────────────────────

// In dev, Next.js proxies /api/* → http://localhost:8080/* (next.config.ts)
// In prod Docker, NEXT_PUBLIC_API_BASE_URL is not needed because the same proxy
// via BACKEND_BASE_URL env var is used server-side. Client-side calls still go
// through /api which is handled by Next.js rewrites.
const BASE_URL =
    (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_API_BASE_URL) ||
    '/api';

const DEFAULT_HEADERS: HeadersInit = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
};

// ─── Core request helper ──────────────────────────────────────────────────────

async function request<T>(
    method: string,
    path: string,
    options: {
        body?: unknown;
        params?: Record<string, string | number | boolean | undefined | null>;
        headers?: HeadersInit;
        rawBody?: BodyInit;   // for form-encoded posts (login)
        unwrap?: boolean;     // false = return raw JSON (no ResponseStructure)
    } = {},
): Promise<T> {
    const { body, params, headers, rawBody, unwrap = true } = options;

    // Build URL with query params
    let url = `${BASE_URL}${path}`;
    if (params) {
        const qs = new URLSearchParams();
        for (const [k, v] of Object.entries(params)) {
            if (v !== undefined && v !== null) qs.set(k, String(v));
        }
        const qsStr = qs.toString();
        if (qsStr) url += `?${qsStr}`;
    }

    // Merge headers
    const mergedHeaders: HeadersInit =
        rawBody
            ? { ...(headers ?? {}) }          // let caller set Content-Type for form
            : { ...DEFAULT_HEADERS, ...(headers ?? {}) };

    const fetchOptions: RequestInit = {
        method,
        headers: mergedHeaders,
        credentials: 'include',
    };

    if (rawBody !== undefined) {
        fetchOptions.body = rawBody;
    } else if (body !== undefined) {
        fetchOptions.body = JSON.stringify(body);
    }

    const res = await fetch(url, fetchOptions);

    // Parse response body
    let json: unknown;
    const contentType = res.headers.get('content-type') ?? '';
    if (contentType.includes('application/json') && res.status !== 204) {
        json = await res.json().catch(() => ({}));
    }

    if (!res.ok) {
        const wrapped = json as Partial<ApiResponse<unknown>>;
        const message =
            wrapped?.message ||
            res.statusText ||
            `HTTP ${res.status}`;
        throw new ApiError(res.status, message, wrapped?.data);
    }

    // Unwrap ResponseStructure<T> → return T
    if (unwrap) {
        return (json as ApiResponse<T>).data;
    }
    return json as T;
}

// ─── Public API ───────────────────────────────────────────────────────────────

export const httpClient = {
    get<T>(
        path: string,
        params?: Record<string, string | number | boolean | undefined | null>,
    ): Promise<T> {
        return request<T>('GET', path, { params });
    },

    post<T>(path: string, body?: unknown): Promise<T> {
        return request<T>('POST', path, { body });
    },

    /** POST with application/x-www-form-urlencoded (Spring Security login) */
    postForm<T>(path: string, formData: URLSearchParams): Promise<T> {
        return request<T>('POST', path, {
            rawBody: formData,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            unwrap: false,
        });
    },

    put<T>(path: string, body?: unknown): Promise<T> {
        return request<T>('PUT', path, { body });
    },

    putWithParams<T>(
        path: string,
        params: Record<string, string | number | boolean | undefined | null>,
    ): Promise<T> {
        return request<T>('PUT', path, { params });
    },

    patch<T>(path: string, body?: unknown): Promise<T> {
        return request<T>('PATCH', path, { body });
    },

    delete<T = void>(path: string): Promise<T> {
        return request<T>('DELETE', path);
    },
};

export default httpClient;
