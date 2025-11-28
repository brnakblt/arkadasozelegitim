import { NextRequest, NextResponse } from 'next/server';
import { nextcloudService } from '@/services/nextcloudService';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

export async function DELETE(request: NextRequest) {
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

        // 2. Get Params
        const searchParams = request.nextUrl.searchParams;
        const path = searchParams.get('path') || '';
        const filename = searchParams.get('filename');

        if (!filename) {
            return NextResponse.json({ error: 'Filename required' }, { status: 400 });
        }

        // 3. Delete File
        await nextcloudService.deleteFile(username, path, filename);

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Delete Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
