// src/app/api/admin/menu/route.js
import { db } from '@/lib/conetc';

// GET: Lista todos os produtos
export async function GET() {
  try {
    const [rows] = await db.query(`
      SELECT 
        p.id,
        p.name,
        p.price,
        p.image_url,
        p.description,
        p.available,
        p.category_id,
        c.name AS category
      FROM products p
      LEFT JOIN categories c ON c.id = p.category_id
      ORDER BY c.name, p.name
    `);

    const formatted = rows.map(item => ({
      id: item.id,
      name: item.name,
      price: Number(item.price),
      image_url: item.image_url,
      description: item.description,
      available: !!item.available,
      category_id: item.category_id,
      category: item.category || 'Sem Categoria'
    }));

    return Response.json(formatted);
  } catch (err) {
    console.error('Erro ao buscar produtos:', err);
    return Response.json([], { status: 500 });
  }
}

// POST: Adiciona um novo produto
export async function POST(request) {
  try {
    const { name, price, description, image_url, available, category_id } = await request.json();

    if (!name || !price || !category_id) {
      return Response.json({ error: 'Campos obrigatórios ausentes.' }, { status: 400 });
    }

    await db.query(
      `INSERT INTO products (name, price, description, image_url, available, category_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, price, description || '', image_url || '', available ? 1 : 0, category_id]
    );

    return Response.json({ success: true });
  } catch (err) {
    console.error('Erro ao adicionar produto:', err);
    return Response.json({ error: 'Erro ao adicionar produto.' }, { status: 500 });
  }
}

// PUT: Edita um produto existente
export async function PUT(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return Response.json({ error: 'Produto não informado' }, { status: 400 });

    const { name, price, description, image_url, available, category_id } = await request.json();

    await db.query(
      `UPDATE products SET name = ?, price = ?, description = ?, image_url = ?, available = ?, category_id = ?
       WHERE id = ?`,
      [name, price, description || '', image_url || '', available ? 1 : 0, category_id, id]
    );

    return Response.json({ success: true });
  } catch (err) {
    console.error('Erro ao editar produto:', err);
    return Response.json({ error: 'Erro ao editar produto.' }, { status: 500 });
  }
}

// DELETE: Remove produto
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return Response.json({ error: 'Produto não informado' }, { status: 400 });

    await db.query('DELETE FROM products WHERE id = ?', [id]);
    return Response.json({ success: true });
  } catch (err) {
    console.error('Erro ao deletar produto:', err);
    return Response.json({ error: 'Erro ao deletar produto.' }, { status: 500 });
  }
}
