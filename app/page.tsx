import BaseLayout from './components/layout/BaseLayout';
import MediaGrid from './components/features/media/MediaGrid';
import AddMediaButton from './components/features/media/AddMediaButton';
import prisma from '@/lib/prisma';
import MediaCard from './components/features/media/MediaCard';

export default async function Home() {
  const media = await prisma.media.findMany({
    include: {
      tags: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <BaseLayout>
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {/* 搜索框
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <input
              type="text"
              placeholder="搜索内容..."
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div> */}

          {/* 内容区 */}
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            {media.length > 0 ? (
              <MediaGrid media={media} />
            ) : (
              <div className="flex items-center justify-center h-[calc(100vh-200px)]">
                <span className="text-gray-400">暂无内容</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 添加按钮 - 固定在右下角 */}
      <div className="fixed bottom-8 right-8">
        <AddMediaButton />
      </div>
    </BaseLayout>
  );
} 