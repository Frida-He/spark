import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // 获取表单数据
    const file = formData.get('file') as File;
    const fileName = formData.get('fileName') as string;
    const type = formData.get('type') as string;
    const aiTool = formData.get('aiTool') as string;
    const prompt = formData.get('prompt') as string;

    // 添加日志
    console.log('Received form data:', {
      fileName,
      type,
      aiTool,
      prompt
    });

    if (!file) {
      throw new Error('No file uploaded');
    }

    // 生成文件名
    const timestamp = Date.now();
    const extension = file.name.split('.').pop();
    const newFileName = `${timestamp}.${extension}`;
    const filePath = `/media/${newFileName}`;
    
    // 获取文件数据
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 使用事务处理文件保存和数据库操作
    const result = await prisma.$transaction(async (tx) => {
      // 先创建数据库记录
      const media = await tx.media.create({
        data: {
          fileName,
          filePath,
          type,
          aiTool,
          prompt,
        },
      });

      // 再保存文件
      const savePath = join(process.env.MEDIA_STORAGE_PATH || '/Users/Frida/Documents/ai-spark', newFileName);
      await writeFile(savePath, buffer);

      return media;
    });

    console.log('File uploaded successfully:', result);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Upload error:', error);
    // 返回详细的错误信息
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '文件处理失败' },
      { status: 500 }
    );
  }
}