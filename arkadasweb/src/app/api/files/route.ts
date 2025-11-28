import { NextRequest, NextResponse } from 'next/server';
import { nextcloudService } from '@/services/nextcloudService';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

export async function GET(request: NextRequest) {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify token and get user info from Strapi
    try {
        const userRes = await fetch(`${STRAPI_URL}/api/users/me`, {
            headers: {
                Authorization: authHeader
            }
        });

        if (!userRes.ok) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        const user = await userRes.json();
        const username = user.username;
        
        // Get path from query params
        const searchParams = request.nextUrl.searchParams;
        const subPath = searchParams.get('path') || '';

        // Fetch files from Nextcloud
        const files = await nextcloudService.getDirectoryContents(username, subPath);
        
        return NextResponse.json(files);

    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
