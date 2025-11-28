import { NextRequest, NextResponse } from 'next/server';
import { nextcloudService } from '@/services/nextcloudService';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

export async function POST(request: NextRequest) {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // 1. Verify User
        const userRes = await fetch(`${STRAPI_URL}/api/users/me`, {
            headers: { Authorization: authHeader }
        });

        if (!userRes.ok) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        const user = await userRes.json();
        const username = user.username;

        // 2. Parse Body
        const body = await request.json();
        const { path, folderName } = body;

        if (!folderName) {
            return NextResponse.json({ error: 'Folder name required' }, { status: 400 });
        }

        // 3. Create Directory
        // Ensure path ends with / if it's not empty and doesn't have it
        const cleanSubPath = path.endsWith('/') ? path : (path ? `${path}/` : '');
        const fullPath = `${cleanSubPath}${folderName}`;
        
        await nextcloudService.createDirectory(username, fullPath);

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Create Folder Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
