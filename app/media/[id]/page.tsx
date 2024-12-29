import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import BackButton from '@/app/components/common/BackButton';

// 更新 Media 类型定义
type Media = {
  id: string;
  fileName: string;
  filePath: string;
  type: string;
  aiTool: string;
  prompt: string;
  tags: { id: string; name: string }[];
  createdAt: Date;
  updatedAt: Date;
};

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

  const mediaUrl = `/api/media/${media.filePath}`;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* 左侧：媒体展示 */}
            <div className="lg:w-2/3 bg-gray-100">
              <div className="aspect-video">
                {media.type === 'image' ? (
                  <img
                    src={mediaUrl}
                    alt={media.fileName}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <video
                    src={mediaUrl}
                    controls
                    className="w-full h-full object-contain"
                  />
                )}
              </div>
            </div>

            {/* 右侧：信息展示 */}
            <div className="lg:w-1/3 p-8 space-y-6">
              {/* 标题 */}
              <div>
                <h1 className="text-2xl font-medium text-gray-900">
                  {media.fileName}
                </h1>
              </div>

              {/* Prompt */}
              <div>
                <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
                  Prompt
                </h2>
                <p className="text-gray-700 text-base leading-relaxed">
                  {media.prompt}
                </p>
              </div>

              {/* AI 工具 */}
              <div>
                <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
                  AI 工具
                </h2>
                <p className="text-gray-700">
                  {media.aiTool}
                </p>
              </div>

              {/* 标签 */}
              <div>
                <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
                  标签
                </h2>
                <div className="flex flex-wrap gap-2">
                  {media.tags.length > 0 ? (
                    media.tags.map((tag) => (
                      <span
                        key={tag.id}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700"
                      >
                        {tag.name}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-400 text-sm">暂无</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 返回按钮 */}
        <div className="mt-8 flex justify-center">
          <BackButton />
        </div>
      </div>
    </div>
  );
} 