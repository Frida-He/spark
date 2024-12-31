import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string; tagId: string } }
) {
  try {
    const mediaId = params.id;
    const tagId = params.tagId;

    // 更新媒体记录，解除与标签的关联
    await prisma.media.update({
      where: { id: mediaId },
      data: {
        tags: {
          disconnect: { id: tagId }
        }
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing tag:', error);
    return NextResponse.json(
      { error: '删除标签失败' },
      { status: 500 }
    );
  }
} 