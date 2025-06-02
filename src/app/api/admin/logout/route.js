// app/api/admin/logout/route.js
import { NextResponse } from 'next/server';

export async function POST() {
    const response = NextResponse.json({ message: 'Logout efetuado com sucesso' });

    response.cookies.set('token', '', {
        httpOnly: true,
        secure: true,
        sameSite: 'Strict',
        path: '/',
        expires: new Date(0),
    });
    return response;
}