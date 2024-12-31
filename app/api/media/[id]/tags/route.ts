import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// 添加标签到媒体
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { tagId } = await request.json();

    if (!tagId) {
      return NextResponse.json(
        { error: '标签 ID 是必需的' },
        { status: 400 }
      );
    }

    const media = await prisma.media.update({
      where: { id: params.id },
      data: {
        tags: {
          connect: { id: tagId }
        }
      },
      include: {
        tags: true,
      },
    });

    return NextResponse.json(media);
  } catch (error) {
    console.error('添加标签失败:', error);
    return NextResponse.json(
      { error: '添加标签失败' },
      { status: 500 }
    );
  }
}

// 从媒体中删除标签
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; tagId: string } }
) {
  try {
    const media = await prisma.media.update({
      where: { id: params.id },
      data: {
        tags: {
          disconnect: { id: params.tagId },
        },
      },
      include: {
        tags: true,
      },
    });

    return NextResponse.json(media);
  } catch (error) {
    console.error('删除标签失败:', error);
    return NextResponse.json(
      { error: '删除标签失败' },
      { status: 500 }
    );
  }
} 