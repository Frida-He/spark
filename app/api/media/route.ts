import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

// 使用统一的存储路径
const STORAGE_PATH = process.env.MEDIA_STORAGE_PATH || '/Users/Frida/Documents/ai-spark';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // 获取文件和文件名
    const file = formData.get('file') as File;
    const fileName = formData.get('fileName') as string;
    const newFileName = `${Date.now()}${fileName.substring(fileName.lastIndexOf('.'))}`;
    
    // 确保存储目录存在
    if (!existsSync(STORAGE_PATH)) {
      await mkdir(STORAGE_PATH, { recursive: true });
      console.log('Created storage directory:', STORAGE_PATH);
    }

    // 保存文件到正确的位置
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filePath = join(STORAGE_PATH, newFileName);
    await writeFile(filePath, buffer);
    console.log('File saved:', filePath);

    // 获取标签数据
    const tagsJson = formData.get('tags');
    const tags = tagsJson ? JSON.parse(tagsJson as string) : [];

    // 创建媒体记录
    const result = await prisma.media.create({
      data: {
        fileName: formData.get('fileName') as string,
        filePath: newFileName,
        type: formData.get('type') as string,
        aiTool: formData.get('aiTool') as string,
        prompt: formData.get('prompt') as string,
        tags: {
          connectOrCreate: (tags as { id: string; name: string }[]).map(tag => ({
            where: { id: tag.id },
            create: { name: tag.name }
          }))
        }
      },
      include: {
        tags: true
      }
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error creating media:', error);
    return NextResponse.json(
      { error: '创建媒体文件失败' },
      { status: 500 }
    );
  }
}