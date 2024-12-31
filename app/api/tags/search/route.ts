import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';

    const tags = await prisma.tag.findMany({
      where: {
        name: {
          contains: query
        }
      },
      take: 5 // 限制返回数量
    });

    return NextResponse.json(tags);
  } catch (error) {
    console.error('Error searching tags:', error);
    return NextResponse.json(
      { error: '搜索标签失败' },
      { status: 500 }
    );
  }
} 