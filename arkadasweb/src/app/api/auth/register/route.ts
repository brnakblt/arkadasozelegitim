import { NextRequest, NextResponse } from 'next/server';
import { nextcloudService } from '@/services/nextcloudService';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://127.0.0.1:1337";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { username, email, password, userType } = body;

        // 1. Register in Strapi
        const strapiRes = await fetch(`${STRAPI_URL}/api/auth/local/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username,
                email,
                password,
                userType
            }),
        });

        const strapiData = await strapiRes.json();

        if (!strapiRes.ok) {
            return NextResponse.json(strapiData, { status: strapiRes.status });
        }

        // 2. Create User in Nextcloud
        // We do this asynchronously or await it. If it fails, we might still want to return success for Strapi
        // but log the error. Or we could fail the whole request (but Strapi user is already created).
        // For now, we await and log error but don't block response unless critical.
        // Ideally we should use a queue or transaction, but here we just try.
        try {
            await nextcloudService.createUser(username, password, email);
        } catch (ncError) {
            console.error("Failed to create Nextcloud user:", ncError);
            // Continue, as Strapi registration was successful
        }

        return NextResponse.json(strapiData);

    } catch (error) {
        console.error("Registration Error:", error);
        return NextResponse.json({ error: { message: "Internal Server Error" } }, { status: 500 });
    }
}
