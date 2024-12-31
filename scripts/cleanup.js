const { PrismaClient } = require('@prisma/client');
const { unlink } = require('fs/promises');
const { join } = require('path');
const { existsSync } = require('fs');

const prisma = new PrismaClient();
const STORAGE_PATH = '/Users/Frida/Documents/ai-spark';

async function cleanup() {
  try {
    // 获取所有媒体记录
    const allMedia = await prisma.media.findMany();
    console.log(`开始清理，找到 ${allMedia.length} 个媒体记录`);
    
    // 删除文件
    for (const media of allMedia) {
      const filePath = join(STORAGE_PATH, media.filePath);
      if (existsSync(filePath)) {
        await unlink(filePath);
        console.log(`已删除文件: ${filePath}`);
      } else {
        console.log(`文件不存在: ${filePath}`);
      }
    }

    // 删除数据库记录
    const deletedMedia = await prisma.media.deleteMany();
    console.log(`已从数据库删除 ${deletedMedia.count} 条媒体记录`);
    
    // 显示剩余的标签
    const remainingTags = await prisma.tag.findMany();
    console.log(`保留的标签: ${remainingTags.map(tag => tag.name).join(', ')}`);

    // 验证清理结果
    const remainingMedia = await prisma.media.findMany();
    console.log(`清理后剩余媒体记录: ${remainingMedia.length}`);

  } catch (error) {
    console.error('清理出错:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanup(); 