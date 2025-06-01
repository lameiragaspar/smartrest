import { db } from '@/lib/conetc';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'chave-secreta-temporaria';

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return Response.json({ message: 'E-mail e senha são obrigatórios.' }, { status: 400 });
    }

    const [users] = await db.execute(
      'SELECT id, name, email, password_hash, profession FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return Response.json({ message: 'Usuário não encontrado.' }, { status: 401 });
    }

    const user = users[0];

    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return Response.json({ message: 'Email ou senha incorretos' }, { status: 402 });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.profession,
      },
      SECRET_KEY,
      { expiresIn: '4h' }
    );

    return Response.json({
      token,
      message: 'Login realizado com sucesso.',
    }, { status: 200 });

  } catch (error) {
    console.error('Erro no login:', error);
    return Response.json({ message: 'Erro interno do servidor.' }, { status: 500 });
  }
}
