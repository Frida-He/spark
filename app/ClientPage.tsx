'use client';

import { useState } from 'react';
import BaseLayout from './components/layout/BaseLayout';
import MediaGrid from './components/features/media/MediaGrid';
import AddMediaButton from './components/features/media/AddMediaButton';
import Sidebar from './components/layout/Sidebar';
import { Media } from '@prisma/client';

interface ClientPageProps {
  initialMedia: Media[];
}

export default function ClientPage({ initialMedia }: ClientPageProps) {
  const [filters, setFilters] = useState({
    aiTools: [] as string[],
    fileTypes: [] as string[],
  });

  // 处理筛选变化
  const handleFilterChange = (newFilters: {
    aiTools: string[];
    fileTypes: string[];
  }) => {
    setFilters(newFilters);
  };

  // 根据筛选条件过滤媒体列表
  const filteredMedia = initialMedia.filter(item => {
    if (filters.aiTools.length === 0 && filters.fileTypes.length === 0) {
      return true;
    }
    const matchAiTool = filters.aiTools.length === 0 || filters.aiTools.includes(item.aiTool);
    const matchFileType = filters.fileTypes.length === 0 || filters.fileTypes.includes(item.type);
    return matchAiTool && matchFileType;
  });

  return (
    <BaseLayout>
      <Sidebar 
        onFilterChange={handleFilterChange}
        className="flex-shrink-0"
      />
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-[1600px] mx-auto">
          {filteredMedia.length > 0 ? (
            <MediaGrid media={filteredMedia} />
          ) : (
            <div className="flex items-center justify-center h-[calc(100vh-200px)]">
              <span className="text-gray-400">暂无内容</span>
            </div>
          )}
        </div>
      </div>
      <div className="fixed bottom-8 right-8">
        <AddMediaButton />
      </div>
    </BaseLayout>
  );
} 