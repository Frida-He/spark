'use client';

import { useState } from 'react';

interface SidebarProps {
  className?: string;
  onFilterChange?: (filters: {
    aiTools: string[];
    fileTypes: string[];
  }) => void;
  availableAiTools?: string[];
}

export default function Sidebar({ 
  className = '', 
  onFilterChange,
  availableAiTools = ['MidJourney', 'DALL-E', 'Stable Diffusion']
}: SidebarProps) {
  // 在组件内部管理状态
  const [selectedAiTools, setSelectedAiTools] = useState<string[]>([]);
  const [selectedFileTypes, setSelectedFileTypes] = useState<string[]>([]);

  // 处理 AI 工具选择
  const handleAiToolChange = (tool: string, checked: boolean) => {
    const newTools = checked 
      ? [...selectedAiTools, tool]
      : selectedAiTools.filter(t => t !== tool);
    setSelectedAiTools(newTools);
    onFilterChange?.({ aiTools: newTools, fileTypes: selectedFileTypes });
  };

  // 处理文件类型选择
  const handleFileTypeChange = (type: string, checked: boolean) => {
    const newTypes = checked
      ? [...selectedFileTypes, type]
      : selectedFileTypes.filter(t => t !== type);
    setSelectedFileTypes(newTypes);
    onFilterChange?.({ aiTools: selectedAiTools, fileTypes: newTypes });
  };

  return (
    <aside className={`w-64 bg-white shadow-sm border-r border-gray-200 ${className}`}>
      {/* 搜索框 */}
      <div className="p-3 border-b border-gray-200">
        <input
          type="search"
          placeholder="搜索内容..."
          className="w-full px-3 py-1.5 text-sm rounded-md border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      
      {/* 筛选区域 */}
      <div className="p-3 space-y-4">
        {/* AI 工具筛选 */}
        <div>
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">AI 工具</h3>
          <div className="space-y-1">
            {availableAiTools.map(tool => (
              <label key={tool} className="flex items-center py-0.5">
                <input
                  type="checkbox"
                  checked={selectedAiTools.includes(tool)}
                  onChange={(e) => handleAiToolChange(tool, e.target.checked)}
                  className="w-3.5 h-3.5 rounded text-blue-500 border-gray-300 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-600">{tool}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 文件类型筛选 */}
        <div>
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">文件类型</h3>
          <div className="space-y-1">
            {['image', 'video'].map(type => (
              <label key={type} className="flex items-center py-0.5">
                <input
                  type="checkbox"
                  checked={selectedFileTypes.includes(type)}
                  onChange={(e) => handleFileTypeChange(type, e.target.checked)}
                  className="w-3.5 h-3.5 rounded text-blue-500 border-gray-300 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-600">
                  {type === 'image' ? '图片' : '视频'}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
} 