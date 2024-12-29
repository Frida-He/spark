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

    // 获取和处理标签
    const tags = formData.get('tags');
    console.log('Received tags:', tags);
    
    const tagNames = tags ? JSON.parse(tags as string) : [];
    console.log('Parsed tags:', tagNames);

    // 创建或获取标签
    const tagObjects = await Promise.all(
      tagNames.map(async (name: string) => {
        return await prisma.tag.upsert({
          where: { name },
          create: { name },
          update: {}
        });
      })
    );

    // 创建媒体记录
    const result = await prisma.media.create({
      data: {
        fileName,
        filePath: newFileName,  // 只存储文件名，不包含完整路径
        type: formData.get('type') as string,
        aiTool: formData.get('aiTool') as string,
        prompt: formData.get('prompt') as string,
        tags: {
          connect: tagObjects.map(tag => ({ id: tag.id }))
        }
      },
      include: {
        tags: true
      }
    });

    console.log('Created media with tags:', result);
    return NextResponse.json(result);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '处理失败' },
      { status: 500 }
    );
  }
}