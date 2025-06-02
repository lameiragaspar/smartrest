import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

// Regras por rota
const accessRules = {
  '/adm': ['admin', 'chef', 'garcon', 'cozinheiro'],
  '/adm/produtos/novo': ['chef'], // só o chef pode adicionar item
};

export async function middleware(request) {
  const token = request.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const { payload } = await jwtVerify(token, secret);
    const userRole = payload.role;

    const path = request.nextUrl.pathname;

    // Encontre a regra de acesso correspondente
    const matchedRule = Object.entries(accessRules).find(([routePrefix]) =>
      path.startsWith(routePrefix)
    );

    if (matchedRule) {
      const [, allowedRoles] = matchedRule;

      if (!allowedRoles.includes(userRole)) {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }
    }

    return NextResponse.next();
  } catch (err) {
    console.error('[JWT_ERROR]', err);
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: ['/adm/:path*'], // aplica somente para rotas /adm/*
};
