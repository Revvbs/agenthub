import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { withAuth, AuthenticatedRequest } from '@/lib/auth-middleware';
import bcrypt from 'bcryptjs';

// GET /api/user - Get user profile
async function getUser(req: AuthenticatedRequest) {
  try {
    const userId = req.user?.userId;

    const result = await query(
      `SELECT id, email, plan, tokens_limit, tokens_used, created_at, updated_at
       FROM users
       WHERE id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const user = result.rows[0];

    // Get agent count
    const agentCountResult = await query(
      'SELECT COUNT(*) as count FROM agents WHERE user_id = $1',
      [userId]
    );

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        plan: user.plan,
        tokensLimit: user.tokens_limit,
        tokensUsed: user.tokens_used,
        agentCount: parseInt(agentCountResult.rows[0].count),
        createdAt: user.created_at,
        updatedAt: user.updated_at,
      },
    });
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user data' },
      { status: 500 }
    );
  }
}

// PATCH /api/user - Update user profile
async function updateUser(req: AuthenticatedRequest) {
  try {
    const userId = req.user?.userId;
    const body = await req.json();
    const { email, password, plan } = body;

    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (email !== undefined) {
      // Check if email is already taken
      const existingUser = await query(
        'SELECT id FROM users WHERE email = $1 AND id != $2',
        [email, userId]
      );

      if (existingUser.rows.length > 0) {
        return NextResponse.json(
          { error: 'Email already in use' },
          { status: 400 }
        );
      }

      updates.push(`email = $${paramCount++}`);
      values.push(email);
    }

    if (password !== undefined) {
      if (password.length < 8) {
        return NextResponse.json(
          { error: 'Password must be at least 8 characters' },
          { status: 400 }
        );
      }

      const passwordHash = await bcrypt.hash(password, 10);
      updates.push(`password_hash = $${paramCount++}`);
      values.push(passwordHash);
    }

    if (plan !== undefined) {
      // Update token limit based on plan
      const tokensLimit = plan === 'pro' ? 5000000 : 500000;
      updates.push(`plan = $${paramCount++}`);
      values.push(plan);
      updates.push(`tokens_limit = $${paramCount++}`);
      values.push(tokensLimit);
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { error: 'No fields to update' },
        { status: 400 }
      );
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(userId);

    const result = await query(
      `UPDATE users 
       SET ${updates.join(', ')}
       WHERE id = $${paramCount++}
       RETURNING id, email, plan, tokens_limit, tokens_used, updated_at`,
      values
    );

    const user = result.rows[0];

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        plan: user.plan,
        tokensLimit: user.tokens_limit,
        tokensUsed: user.tokens_used,
        updatedAt: user.updated_at,
      },
    });
  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

export const GET = withAuth(getUser);
export const PATCH = withAuth(updateUser);
