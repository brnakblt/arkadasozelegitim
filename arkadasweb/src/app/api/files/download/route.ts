import { NextRequest, NextResponse } from 'next/server';
import { nextcloudService } from '@/services/nextcloudService';
import { Readable } from 'stream';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

export async function GET(request: NextRequest) {
    const authHeader = request.headers.get('Authorization');
    // Note: For downloads via <a> tag or window.open, headers are hard to send.
    // We might need to accept token via query param for downloads, 
    // BUT for security it's better to use a blob fetch in frontend.
    // Let's assume frontend uses fetch with auth header and creates a blob URL.
    
    if (!authHeader) {
        // Fallback: check query param 'token'
        const token = request.nextUrl.searchParams.get('token');
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
    }

    const token = authHeader ? authHeader.replace('Bearer ', '') : request.nextUrl.searchParams.get('token');

    try {
        // 1. Verify User
        const userRes = await fetch(`${STRAPI_URL}/api/users/me`, {
            headers: { Authorization: `Bearer ${token}` }
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

        // 3. Get Stream
        const stream = nextcloudService.getFileStream(username, path, filename);

        // 4. Return Response
        // Next.js App Router streaming response
        // We need to convert the Node.js Readable stream to a Web ReadableStream
        const webStream = new ReadableStream({
            start(controller) {
                stream.on('data', (chunk) => controller.enqueue(chunk));
                stream.on('end', () => controller.close());
                stream.on('error', (err) => controller.error(err));
            }
        });

        return new NextResponse(webStream, {
            headers: {
                'Content-Disposition': `attachment; filename="${filename}"`,
                'Content-Type': 'application/octet-stream',
            },
        });

    } catch (error) {
        console.error("Download Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
