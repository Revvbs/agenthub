import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { query } from '@/lib/db';
import { signToken } from '@/lib/jwt';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, plan = 'starter' } = body;

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Set token limits based on plan
    const tokensLimit = plan === 'pro' ? 5000000 : 500000;

    // Create user
    const result = await query(
      `INSERT INTO users (email, password_hash, plan, tokens_limit)
       VALUES ($1, $2, $3, $4)
       RETURNING id, email, plan, tokens_limit, tokens_used, created_at`,
      [email, passwordHash, plan, tokensLimit]
    );

    const user = result.rows[0];

    // Generate JWT
    const token = signToken({
      userId: user.id,
      email: user.email,
      plan: user.plan,
    });

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        plan: user.plan,
        tokensLimit: user.tokens_limit,
        tokensUsed: user.tokens_used,
        createdAt: user.created_at,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    );
  }
}
