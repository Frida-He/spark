'use client';

import { useState, useRef, useEffect } from 'react';

interface Tag {
  id: string;
  name: string;
}

interface TagManagerProps {
  tags: Tag[];  // 当前已有的标签
  onAddTag: (tagName: string) => Promise<void>;  // 添加标签的回调
  onRemoveTag: (tagId: string) => Promise<void>; // 删除标签的回调
  preventFormSubmit?: boolean;
}

export default function TagManager({ tags, onAddTag, onRemoveTag, preventFormSubmit }: TagManagerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // 当进入添加模式时,自动聚焦输入框
  useEffect(() => {
    if (isAdding && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAdding]);

  // 处理添加标签
  const handleAdd = async () => {
    const tagName = inputValue.trim();
    if (tagName) {
      try {
        await onAddTag(tagName);
        setInputValue('');
        setIsAdding(false);
      } catch (error) {
        console.error('Failed to add tag:', error);
      }
    }
  };

  // 处理按键事件
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // 阻止表单提交
      handleAdd();
    } else if (e.key === 'Escape') {
      setIsAdding(false);
      setInputValue('');
    }
  };

  // 处理输入框失焦
  const handleBlur = () => {
    handleAdd();
  };

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {/* 现有标签列表 */}
      {tags.map((tag) => (
        <div
          key={tag.id}
          className="group flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full"
        >
          <span className="text-sm font-medium">{tag.name}</span>
          <button
            onClick={() => onRemoveTag(tag.id)}
            className="hidden group-hover:inline-flex items-center justify-center w-4 h-4 rounded-full bg-blue-200 hover:bg-blue-300 transition-colors"
          >
            <span className="sr-only">删除标签</span>
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}

      {/* 添加标签输入框 */}
      {isAdding ? (
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          className="px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="输入标签名称"
        />
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-1 px-3 py-1 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          添加标签
        </button>
      )}
    </div>
  );
} 