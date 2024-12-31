import { PrismaClient } from '@prisma/client';
import { unlink } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

const prisma = new PrismaClient();
const STORAGE_PATH = '/Users/Frida/Documents/ai-spark';

async function cleanup() {
  try {
    // 获取所有媒体记录
    const allMedia = await prisma.media.findMany();
    console.log(`Found ${allMedia.length} media records`);
    
    // 删除文件
    for (const media of allMedia) {
      const filePath = join(STORAGE_PATH, media.filePath);
      if (existsSync(filePath)) {
        await unlink(filePath);
        console.log(`Deleted file: ${filePath}`);
      } else {
        console.log(`File not found: ${filePath}`);
      }
    }

    // 删除数据库中的媒体记录（但保留标签）
    const deletedMedia = await prisma.media.deleteMany();
    console.log(`Deleted ${deletedMedia.count} media records from database`);
    
    // 显示剩余的标签
    const remainingTags = await prisma.tag.findMany();
    console.log(`Remaining tags: ${remainingTags.map(tag => tag.name).join(', ')}`);

  } catch (error) {
    console.error('Cleanup error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanup(); 