import { NextResponse } from 'next/server';

const getToken = async () => {
    try {
        const tokenUrl = process.env.NEXT_PUBLIC_TEST_ISTUDIO_TOKEN_URL;
        if (!tokenUrl) {
            throw new Error("Token URL is not configured");
        }
        const response = await fetch(
            tokenUrl,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: new URLSearchParams({
                    grant_type: "password",
                    username: process.env.NEXT_PUBLIC_ISTUDIO_USERNAME_TEST || '',
                    password: process.env.NEXT_PUBLIC_ISTUDIO_PASSWORD_TEST || '',
                }),
            }
        )

        if (!response.ok) {
            throw new Error("Network response was not ok")
        }

        const data = await response.json()
        return data.access_token
    } catch (error) {
        console.error(
            { error: "TOKEN:Failed to fetch token" },
            { status: 500 }
        )
        throw error;
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const token = await getToken();
        
        if (!token) {
            throw new Error("Failed to fetch token");
        }

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_TEST_ISTUDIO_GETTARIFF_URL}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(data)
            }
        );

        if (!response.ok) {
            throw new Error("Failed to import contract");
        }

        const result = await response.json();
        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error('Error importing contract:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Unknown error occurred' },
            { status: 500 }
        );
    }
}