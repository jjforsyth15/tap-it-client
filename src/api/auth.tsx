import { apiRequest } from "./api";


export function registerUser(data: { 
    email: string; 
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
}) {
    return apiRequest('/auth/register', {  
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export async function loginUser(email: string, password: string ) {
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);

    const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
    });

    const data = await response.json();

    if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Login failed');
    }

    return data;
}