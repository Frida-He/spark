import { PrismaClient } from '@prisma/client';

// 声明 prisma 变量
let prisma: PrismaClient;

// 根据环境变量判断当前运行环境
if (process.env.NODE_ENV === 'production') {
  // 生产环境：直接创建新的 PrismaClient 实例
  prisma = new PrismaClient();
} else {
  // 开发环境：使用全局变量来缓存 PrismaClient 实例
  
  // 为什么要这样做？
  // 1. Next.js 在开发模式下会频繁热重载
  // 2. 每次热重载都会重新执行这个文件
  // 3. 如果每次都创建新的 PrismaClient 实例，会导致连接数过多
  // 4. 使用全局变量可以在热重载之间保持同一个实例
  
  if (!(global as any).prisma) {
    // 如果全局变量中还没有 prisma 实例，就创建一个
    (global as any).prisma = new PrismaClient();
  }
  // 使用全局变量中的 prisma 实例
  prisma = (global as any).prisma;
}

// 导出 prisma 实例，供其他文件使用
export default prisma; 