"use client"

import { UserConfig, getUserConfig } from "@/lib/storage"

// Custom API error class for better error handling
export class ApiError extends Error {
    info: any;
    status: number;

    constructor(status: number, statusText: string, info?: any) {
        super(`API error: ${status} ${statusText}`);
        this.name = 'ApiError';
        this.status = status;
        this.info = info || {};
    }
}

// Base fetcher function that all API requests will use
export async function fetcher<T>(
    url: string,
    options?: RequestInit
): Promise<T> {
    const config = getUserConfig()
    if (!config) {
        throw new Error("User configuration not found")
    }

    const fullUrl = url.startsWith('http') ? url : `${config.baseUrl}${url}`

    const response = await fetch(fullUrl, {
        ...options,
        headers: {
            "Authorization": `Bearer ${config.apiKey}`,
            "Content-Type": "application/json",
            ...options?.headers,
        },
    })

    if (!response.ok) {
        const errorInfo = await response.json().catch(() => ({}))
        throw new ApiError(response.status, response.statusText, errorInfo)
    }

    // Check content type to determine how to parse the response
    const contentType = response.headers.get('content-type')
    if (contentType?.includes('application/json')) {
        return response.json() as Promise<T>
    } else if (contentType?.includes('text/')) {
        return (await response.text()) as unknown as T
    }

    return response.json() as Promise<T>
}
// Generic fetch function for API calls
export async function apiFetch<T>(url: string, method: string, body?: any): Promise<T> {
    return fetcher<T>(url, {
        method,
        body: body ? JSON.stringify(body) : undefined,
    })
}