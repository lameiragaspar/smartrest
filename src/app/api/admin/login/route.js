// src/app/api/admin/login/route.js

import { db } from '@/lib/conetc';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'sua_chave_secreta_segura';

export async function POST(req) {
  try {
    const { email, senha } = await req.json();

    if (!email || !senha) {
      return NextResponse.json({ message: 'Email e senha são obrigatórios' }, { status: 400 });
    }

    const [rows] = await db.execute('SELECT * FROM users WHERE email = ? LIMIT 1', [email]);

    if (!rows || rows.length === 0) {
      return NextResponse.json({ message: 'Usuário não encontrado' }, { status: 401 });
    }

    const usuario = rows[0];

    const senhaCorreta = await bcrypt.compare(senha, usuario.password_hash);
    if (!senhaCorreta) {
      return NextResponse.json({ message: 'Senha incorreta' }, { status: 401 });
    }

    const token = jwt.sign({ id: usuario.id, email: usuario.email, role: usuario.role }, JWT_SECRET, {
      expiresIn: '2h',
    });

    return NextResponse.json({ token });
  } catch (error) {
    console.error('[LOGIN_ERROR]', error);
    return NextResponse.json({ message: 'Erro interno no login' }, { status: 500 });
  }
}