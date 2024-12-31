'use client';

import { useState } from 'react';
import TagManager from '../tags/TagManager';
import Image from 'next/image';

interface Tag {
  id: string;
  name: string;
}

interface MediaDetailCardProps {
  id: string;
  fileName: string;
  filePath: string;
  type: string;
  aiTool: string;
  prompt: string;
  tags: Tag[];
}

export default function MediaDetailCard({
  id,
  fileName,
  filePath,
  type,
  aiTool,
  prompt,
  tags: initialTags,
}: MediaDetailCardProps) {
  const [tags, setTags] = useState<Tag[]>(initialTags);
  
  // 处理添加标签
  const handleAddTag = async (tagName: string): Promise<void> => {
    try {
      const response = await fetch('/api/tags', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: tagName }),
      });

      if (!response.ok) {
        throw new Error('添加标签失败');
      }

      const newTag: Tag = await response.json();
      
      // 添加标签关联
      const linkResponse = await fetch(`/api/media/${id}/tags`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tagId: newTag.id }),
      });

      if (!linkResponse.ok) {
        throw new Error('关联标签失败');
      }

      setTags(prev => [...prev, newTag]);
    } catch (error) {
      console.error('添加标签失败:', error);
    }
  };

  // 处理删除标签
  const handleRemoveTag = async (tagId: string): Promise<void> => {
    try {
      const response = await fetch(`/api/media/${id}/tags/${tagId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('删除标签失败');
      }

      // 更新本地状态，移除被删除的标签
      setTags(prev => prev.filter(tag => tag.id !== tagId));
    } catch (error) {
      console.error('删除标签失败:', error);
    }
  };

  // 从 filePath 中提取文件名
  const filename = filePath?.split('/').pop();
  // 构建 API URL
  const mediaUrl = filename ? `/api/media/${filename}` : '';

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 左侧：媒体预览 */}
          <div className="relative aspect-square max-h-[800px]">
            {type === 'image' ? (
              <Image
                src={mediaUrl}
                alt={fileName}
                fill
                className="object-contain"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                onError={(e: any) => {
                  console.error('Image load error:', { fileName, mediaUrl });
                  e.currentTarget.src = '/placeholder.png';
                }}
              />
            ) : (
              <video
                src={mediaUrl}
                controls
                className="w-full h-full object-contain"
                onError={(e) => {
                  console.error('Video load error:', { fileName, mediaUrl });
                }}
              />
            )}
          </div>

          {/* 右侧：详细信息 */}
          <div className="p-8 space-y-8">
            {/* AI 工具 */}
            <div>
              <h3 className="text-lg font-medium text-gray-500 mb-2">AI 生成工具</h3>
              <p className="text-gray-900">{aiTool}</p>
            </div>

            {/* Prompt */}
            <div>
              <h3 className="text-lg font-medium text-gray-500 mb-2">Prompt</h3>
              <p className="text-gray-900 whitespace-pre-wrap">{prompt}</p>
            </div>

            {/* 标签管理 */}
            <div>
              <h3 className="text-lg font-medium text-gray-500 mb-2">标签</h3>
              <TagManager
                tags={tags}
                onAddTag={handleAddTag}
                onRemoveTag={handleRemoveTag}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 