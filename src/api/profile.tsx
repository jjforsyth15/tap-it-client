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
        }),
    });
    
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.detail || 'Profile creation failed');
    }


    updateWebsiteUrl(data.profile.profile_id, websiteUrl || "", token).catch(error => {
        console.error('Failed to update website URL:', error);
    });

    return data;
}


export async function updateWebsiteUrl(profileId: string, websiteUrl: string, token: string) {
    const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/profiles/${profileId}/update_website_url?website_url=${encodeURIComponent(websiteUrl)}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    }); 

    const data = await response.json();

    if (!response.ok) 
        throw new Error(data.detail || 'Failed to update website URL');

    return data;
}


export async function getMyProfiles(token: string) {
    const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/profiles/me`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.detail || 'Failed to fetch profiles');
    }

    return data;
}