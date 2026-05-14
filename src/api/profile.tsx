export async function createProfile(
    token: string,
    name: string, 
    bio: string,
    websiteUrl?: string
) {
    const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/profiles/create_profile`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            profile_name: name,
            bio,
            website_url: websiteUrl,
        }),
    });
    
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.detail || 'Profile creation failed');
    }

    return data;
}