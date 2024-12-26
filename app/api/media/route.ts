import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // 获取表单数据
    const file = formData.get('file') as File;
    const title = formData.get('title') as string;
    const aiTool = formData.get('aiTool') as string;
    const prompt = formData.get('prompt') as string;
    const tags = formData.get('tags') as string;
    const date = formData.get('date') as string;

    // 验证必填字段
    if (!file || !title || !aiTool || !prompt) {
      return NextResponse.json(
        { error: '请填写所有必填项' },
        { status: 400 }
      );
    }

    // 生成文件名
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = join('public', 'uploads', fileName);

    // 保存文件
    await writeFile(filePath, buffer);

    // 保存到数据库
    const media = await prisma.media.create({
      data: {
        fileName: title,
        filePath: `/uploads/${fileName}`,
        type: file.type.startsWith('image/') ? 'image' : 'video',
        aiTool,
        prompt,
        tags: {
          connect: JSON.parse(tags).map((tagId: string) => ({ id: tagId }))
        },
        createdAt: new Date(date),
      },
    });

    return NextResponse.json(media);
  } catch (error) {
    console.error('Error handling upload:', error);
    return NextResponse.json(
      { error: '上传失败' },
      { status: 500 }
    );
  }
}