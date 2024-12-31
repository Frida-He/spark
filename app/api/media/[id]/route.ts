import { NextRequest, NextResponse } from 'next/server';
import { join } from 'path';
import { createReadStream } from 'fs';
import { stat } from 'fs/promises';
import prisma from '@/lib/prisma';

// 获取存储路径
const STORAGE_PATH = process.env.MEDIA_STORAGE_PATH || '/Users/Frida/Documents/ai-spark';

// 获取媒体文件
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 记录请求信息
    console.log('Requested id:', params.id);
    console.log('Storage path:', STORAGE_PATH);

    // 安全处理文件名
    const filename = params.id.replace(/\.\./g, '');
    const filePath = join(STORAGE_PATH, filename);
    
    console.log('Full file path:', filePath);

    // 检查文件是否存在并获取文件信息
    const stats = await stat(filePath);
    if (!stats.isFile()) {
      console.log('Not a file:', filePath);
      return new NextResponse('File not found', { status: 404 });
    }
    console.log('File exists, size:', stats.size);

    // 创建文件流
    const fileStream = createReadStream(filePath);
    
    // 获取文件扩展名并设置正确的 Content-Type
    const ext = filename.split('.').pop()?.toLowerCase();
    let contentType = 'application/octet-stream';
    
    switch (ext) {
      case 'jpg':
      case 'jpeg':
        contentType = 'image/jpeg';
        break;
      case 'png':
        contentType = 'image/png';
        break;
      case 'gif':
        contentType = 'image/gif';
        break;
      case 'webp':
        contentType = 'image/webp';
        break;
      case 'mp4':
        contentType = 'video/mp4';
        break;
      case 'webm':
        contentType = 'video/webm';
        break;
      case 'mov':
        contentType = 'video/quicktime';
        break;
    }

    console.log('Serving file with Content-Type:', contentType);

    // 返回文件流
    return new NextResponse(fileStream as any, {
      headers: {
        'Content-Type': contentType,
        'Content-Length': stats.size.toString(),
        'Cache-Control': 'public, max-age=31536000',
        'Accept-Ranges': 'bytes',
      },
    });
  } catch (error) {
    console.error('Error serving media file:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 