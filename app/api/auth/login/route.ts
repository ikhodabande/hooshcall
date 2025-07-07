import { NextResponse } from 'next/server';

// Simulated user database
const users = [
  {
    id: '1',
    username: 'admin',
    password: 'admin123',
    system: 'holo',
    name: 'مدیر سیستم',
    role: 'admin',
  },
  {
    id: '2',
    username: 'user',
    password: 'user1234',
    system: 'sepidar',
    name: 'کاربر تست',
    role: 'user',
  },
];

export async function POST(request: Request) {
  try {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const body = await request.json();
    const { username, password, system } = body;

    // Find user
    const user = users.find(
      u => u.username === username && u.password === password && u.system === system
    );

    if (!user) {
      return NextResponse.json(
        {
          status: 401,
          message: 'نام کاربری یا رمز عبور اشتباه است',
          data: null,
        },
        { status: 401 }
      );
    }

    // Generate a mock token
    const token = btoa(`${user.id}:${user.username}:${Date.now()}`);

    return NextResponse.json({
      status: 200,
      message: 'ورود موفقیت‌آمیز',
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          system: user.system,
          name: user.name,
          role: user.role,
        },
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      {
        status: 500,
        message: 'خطای سرور',
        data: null,
      },
      { status: 500 }
    );
  }
}
