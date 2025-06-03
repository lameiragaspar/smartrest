import { db } from '@/lib/conetc';
import bcrypt from 'bcryptjs';
import path from 'path';
import fs from 'fs/promises';

export async function POST(req) {
  try {
    const formData = await req.formData();

    const name = formData.get('name');
    const tel = formData.get('tel');
    const email = formData.get('email');
    const password = formData.get('password');
    const birth_date = formData.get('birth_date');
    const role = formData.get('role');
    const status = formData.get('status') || 'ativo';
    const notes = formData.get('notes');

    const photoFile = formData.get('photo');

    if (!name || !email || !password || !role) {
      return Response.json({ message: 'Nome, Email, Senha e Profissão são obrigatórios.' }, { status: 400 });
    }

    if (password.length < 6) {
      return Response.json({ message: 'A senha deve ter pelo menos 6 caracteres.' }, { status: 401 });
    }

    const [existingUsers] = await db.execute('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      return Response.json({ message: 'Email já cadastrado' }, { status: 409 });
    }

    const password_hash = await bcrypt.hash(password, 10);

    let photoPath = null;

    if (photoFile && typeof photoFile.arrayBuffer === 'function') {
      const bytes = Buffer.from(await photoFile.arrayBuffer());
      const timestamp = Date.now();
      const fileName = `${name.replace(/\s+/g, '_')}-${timestamp}${path.extname(photoFile.name)}`;
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'photos');

      // Garante que o diretório exista
      await fs.mkdir(uploadDir, { recursive: true });

      const filePath = path.join(uploadDir, fileName);
      await fs.writeFile(filePath, bytes);

      photoPath = `${fileName}`;
    }

    const [result] = await db.execute(
      `INSERT INTO users (name, tel, email, password_hash, birth_date, photo, role, status, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        tel || null,
        email,
        password_hash,
        birth_date || null,
        photoPath,
        role,
        status,
        notes || null,
      ]
    );

    if (result.affectedRows === 1) {
      return Response.json({
        message: 'Funcionário cadastrado com sucesso!',
        userId: result.insertId,
        photoUrl: photoPath,
      }, { status: 201 });
    } else {
      // Se falhou no DB, remove a imagem
      if (photoPath) {
        const fullPath = path.join(process.cwd(), 'public', photoPath);
        await fs.unlink(fullPath).catch(console.error);
      }
      return Response.json({ message: 'Erro ao inserir dados no banco de dados.' }, { status: 500 });
    }

  } catch (error) {
    console.error('Erro ao registrar chef:', error);
    return Response.json({ message: 'Erro interno do servidor.', error: error.message }, { status: 500 });
  }
}