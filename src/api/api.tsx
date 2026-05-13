const API_URL = process.env.EXPO_PUBLIC_API_URL;

export async function apiRequest(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${API_URL}${endpoint}`, {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        ...options,
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'API request failed');
    }
    return response.json();
}