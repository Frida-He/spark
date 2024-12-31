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

  // 从文件路径中提取文件名
  const filename = media.filePath.split('/').pop();
  const mediaUrl = filename ? `/api/media/${filename}` : '';

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* 主要内容区域 */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* 媒体预览 */}
          <div className="aspect-video w-full relative">
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

          {/* 媒体信息 */}
          <div className="p-6 space-y-4">
            {/* AI 工具信息 */}
            <div>
              <h3 className="text-sm font-medium text-gray-500">AI 生成工具</h3>
              <p className="mt-1 text-lg text-gray-900">{media.aiTool}</p>
            </div>

            {/* Prompt */}
            <div>
              <h3 className="text-sm font-medium text-gray-500">Prompt</h3>
              <p className="mt-1 text-lg text-gray-900">{media.prompt}</p>
            </div>

            {/* 标签 */}
            {media.tags.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">标签</h3>
                <div className="flex flex-wrap gap-2">
                  {media.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 底部返回按钮 */}
        <div className="mt-8 flex justify-center">
          <BackButton />
        </div>
      </div>
    </div>
  );
} 