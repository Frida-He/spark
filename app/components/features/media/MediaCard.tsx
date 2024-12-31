'use client';

import { useRouter } from 'next/navigation';

interface MediaCardProps {
  id: string;
  fileName: string;
  filePath: string;
  type: 'image' | 'video';
  aiTool: string;
  prompt?: string;
  tags?: string[];
  createdAt: Date;
}

export default function MediaCard({
  id,
  fileName,
  filePath,
  type,
  aiTool,
  prompt,
  tags,
}: MediaCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/media/${id}`);
  };

  // 从 /media/filename.jpg 格式的路径中提取文件名
  const filename = filePath?.split('/').pop();
  
  // 构建 API URL
  const mediaUrl = filename ? `/api/media/${filename}` : '';
  
  // 添加调试日志
  // console.log('MediaCard render:', {
  //   filePath,
  //   filename,
  //   mediaUrl
  // });

  // 如果没有有效的 URL，显示占位图
  if (!mediaUrl) {
    console.warn('No valid media URL for:', fileName);
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="aspect-video bg-gray-100 flex items-center justify-center">
          <span className="text-gray-400">无效的媒体文件</span>
        </div>
      </div>
    );
  }

  return (
    <div 
      onClick={handleClick}
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-200"
    >
      {/* 媒体预览 */}
      <div className="aspect-video relative">
        {type === 'image' ? (
          <img
            src={mediaUrl}
            alt={fileName}
            className="w-full h-full object-cover"
            onError={(e) => {
              console.error('Image load error:', { fileName, mediaUrl });
              e.currentTarget.src = '/placeholder.png';
            }}
          />
        ) : (
          <video
            src={mediaUrl}
            className="w-full h-full object-cover"
            controls
            onError={(e) => {
              console.error('Video load error:', { fileName, mediaUrl });
            }}
          />
        )}
      </div>

      {/* 媒体信息 */}
      <div className="p-4">
        <p className="text-sm text-gray-500">
          生成工具: {aiTool}
        </p>
        {prompt && (
          <p className="mt-2 text-sm text-gray-600 line-clamp-2">
            {prompt}
          </p>
        )}
      </div>
    </div>
  );
} 