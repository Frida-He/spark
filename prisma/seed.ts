import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 清除现有数据
  await prisma.media.deleteMany();
  await prisma.tag.deleteMany();

  // 创建标签
  const aiTags = await Promise.all([
    prisma.tag.create({ data: { name: '人物' } }),
    prisma.tag.create({ data: { name: '风景' } }),
    prisma.tag.create({ data: { name: '动物' } }),
    prisma.tag.create({ data: { name: '建筑' } }),
  ]);

  // 创建测试媒体数据
  const mediaData = [
    {
      fileName: '日落风景.jpg',
      filePath: '/images/examples/sunset.png',
      type: 'image',
      aiTool: 'MidJourney',
      prompt: 'A beautiful sunset over mountains, golden hour, dramatic sky, photorealistic --v 5',
      tags: {
        connect: [
          { id: aiTags[1].id }, // 风景
        ],
      },
    },
    {
      fileName: '城市建筑.jpg',
      filePath: '/images/examples/building.png',
      type: 'image',
      aiTool: 'DALL-E',
      prompt: 'Modern futuristic architecture in a bustling city, glass and steel structures, dramatic lighting',
      tags: {
        connect: [
          { id: aiTags[3].id }, // 建筑
        ],
      },
    },
    {
      fileName: '猫咪特写.jpg',
      filePath: '/images/examples/cat.png',
      type: 'image',
      aiTool: 'Stable Diffusion',
      prompt: 'Close-up portrait of a cute cat, soft lighting, detailed fur, depth of field, 8k --v 5',
      tags: {
        connect: [
          { id: aiTags[2].id }, // 动物
        ],
      },
    },
  ];

  // 批量创建媒体数据
  await Promise.all(
    mediaData.map(data =>
      prisma.media.create({
        data,
      })
    )
  );

  console.log('测试数据添加成功！');
}

main()
  .catch(e => {
    console.error('测试数据添加失败：', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 