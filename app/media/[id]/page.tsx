import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import BackButton from '@/app/components/common/BackButton';
import MediaDetailCard from '@/app/components/features/media/MediaDetailCard';

// 强制动态渲染
export const dynamic = 'force-dynamic';

export default async function MediaDetailPage({
  params
}: {
  params: { id: string }
}) {
  const media = await prisma.media.findUnique({
    where: { id: params.id },
    include: {
      tags: true
    }
  });

  if (!media) {
    notFound();
  }

  // 从文件路径中提取文件名
  // const filename = media.filePath.split('/').pop();
  // const mediaUrl = filename ? `/api/media/${filename}` : '';

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <MediaDetailCard {...media} />
      </div>
      {/* 底部返回按钮 */}
      <div className="mt-8 flex justify-center">
        <BackButton />
      </div>
    </div>
  );
} 