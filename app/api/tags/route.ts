import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { name } = await request.json();

    if (!name || typeof name !== 'string') {
      return NextResponse.json(
        { error: '标签名称是必需的' },
        { status: 400 }
      );
    }

    // 先查找是否存在相同名称的标签
    let tag = await prisma.tag.findUnique({
      where: { name },
    });

    // 如果标签不存在，则创建新标签
    if (!tag) {
      tag = await prisma.tag.create({
        data: { name },
      });
    }

    return NextResponse.json(tag);
  } catch (error) {
    console.error('创建标签失败:', error);
    return NextResponse.json(
      { error: '创建标签失败' },
      { status: 500 }
    );
  }
} 