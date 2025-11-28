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

        // 2. Parse Form Data
        const formData = await request.formData();
        const file = formData.get('file') as File | null;
        const path = formData.get('path') as string || '';

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        // 3. Convert File to Buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // 4. Upload to Nextcloud
        await nextcloudService.uploadFile(username, path, buffer, file.name);

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Upload Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
