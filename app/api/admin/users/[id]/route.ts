import { NextResponse } from 'next/server';
import { withAdminAuth } from '@/lib/admin-middleware';
import { query } from '@/lib/db';

export const GET = withAdminAuth(async (req) => {
  try {
    const id = req.url.split('/admin/users/')[1]?.split('?')[0];
    if (!id) return NextResponse.json({ error: 'User ID required' }, { status: 400 });

    const userRes = await query(
      `SELECT id, email, role, plan, tokens_limit, tokens_used, status, created_at, updated_at FROM users WHERE id = $1`,
      [id]
    );
    if (userRes.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const [agentsRes, usageRes, billingRes] = await Promise.all([
      query('SELECT id, name, type, status, created_at FROM agents WHERE user_id = $1 ORDER BY created_at DESC', [id]),
      query('SELECT SUM(tokens_used) as total_tokens, SUM(message_count) as total_messages FROM usage_logs WHERE user_id = $1', [id]),
      query('SELECT id, plan, amount, status, payment_method, transaction_id, created_at, paid_at FROM billing WHERE user_id = $1 ORDER BY created_at DESC', [id]),
    ]);

    return NextResponse.json({
      user: userRes.rows[0],
      agents: agentsRes.rows,
      usage: {
        totalTokens: parseInt(usageRes.rows[0].total_tokens || '0'),
        totalMessages: parseInt(usageRes.rows[0].total_messages || '0'),
      },
      billing: billingRes.rows,
    });
  } catch (error) {
    console.error('Admin user detail error:', error);
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
});

export const PATCH = withAdminAuth(async (req) => {
  try {
    const id = req.url.split('/admin/users/')[1]?.split('?')[0];
    if (!id) return NextResponse.json({ error: 'User ID required' }, { status: 400 });

    const body = await req.json();
    const { plan, tokens_limit, status } = body;

    const updates: string[] = [];
    const params: any[] = [];
    let paramIdx = 1;

    if (plan !== undefined) {
      updates.push(`plan = $${paramIdx}`);
      params.push(plan);
      paramIdx++;
    }
    if (tokens_limit !== undefined) {
      updates.push(`tokens_limit = $${paramIdx}`);
      params.push(tokens_limit);
      paramIdx++;
    }
    if (status !== undefined) {
      updates.push(`status = $${paramIdx}`);
      params.push(status);
      paramIdx++;
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    updates.push(`updated_at = NOW()`);
    params.push(id);

    await query(`UPDATE users SET ${updates.join(', ')} WHERE id = $${paramIdx}`, params);

    return NextResponse.json({ success: true, message: 'User updated' });
  } catch (error) {
    console.error('Admin update user error:', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
});
