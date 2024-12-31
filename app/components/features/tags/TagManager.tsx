'use client';

import { useState, useRef, useEffect } from 'react';
import { useDebounce } from '../../../../lib/hooks/useDebounce';

interface Tag {
  id: string;
  name: string;
}

interface TagManagerProps {
  tags: Tag[];
  onAddTag: (name: string) => Promise<void>;
  onRemoveTag: (id: string) => Promise<void>;
  preventFormSubmit?: boolean;
}

export default function TagManager({ tags, onAddTag, onRemoveTag, preventFormSubmit = false }: TagManagerProps) {
  const [inputValue, setInputValue] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [searchResults, setSearchResults] = useState<Tag[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedSearch = useDebounce(inputValue, 300);

  // 搜索标签
  useEffect(() => {
    const searchTags = async () => {
      if (!debouncedSearch) {
        setSearchResults([]);
        return;
      }

      try {
        const response = await fetch(`/api/tags/search?q=${encodeURIComponent(debouncedSearch)}`);
        if (!response.ok) throw new Error('搜索失败');
        const results = await response.json();
        // 过滤掉已选择的标签
        const filteredResults = results.filter(
          (result: Tag) => !tags.some(tag => tag.id === result.id)
        );
        setSearchResults(filteredResults);
      } catch (error) {
        console.error('搜索标签失败:', error);
        setSearchResults([]);
      }
    };

    searchTags();
  }, [debouncedSearch, tags]);

  // 处理键盘事件
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (preventFormSubmit) {
      e.stopPropagation();
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < searchResults.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : prev);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && searchResults[selectedIndex]) {
          handleSelectTag(searchResults[selectedIndex]);
        } else if (inputValue.trim()) {
          handleAddTag();
        }
        break;
      case 'Escape':
        setIsAdding(false);
        setInputValue('');
        setSearchResults([]);
        break;
    }
  };

  // 处理选择标签
  const handleSelectTag = async (tag: Tag) => {
    await onAddTag(tag.name);
    setInputValue('');
    setSearchResults([]);
    setSelectedIndex(-1);
  };

  // 处理添加新标签
  const handleAddTag = async () => {
    if (!inputValue.trim()) return;
    await onAddTag(inputValue.trim());
    setInputValue('');
    setSearchResults([]);
    setSelectedIndex(-1);
  };

  // 处理输入框失焦
  const handleBlur = () => {
    // 如果输入框为空，关闭输入状态
    if (!inputValue.trim()) {
      setIsAdding(false);
      setInputValue('');
      setSearchResults([]);
      setSelectedIndex(-1);
    }
  };

  return (
    <div className="flex flex-wrap gap-2 items-center relative">
      {/* 现有标签列表 */}
      {tags.map((tag) => (
        <span
          key={tag.id}
          className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
        >
          {tag.name}
          <button
            type="button"
            onClick={() => onRemoveTag(tag.id)}
            className="text-blue-600 hover:text-blue-800"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </span>
      ))}

      {/* 添加标签输入框 */}
      {isAdding ? (
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            className="px-3 py-1 border rounded-full text-sm focus:outline-none focus:border-blue-500"
            placeholder="输入标签名称..."
            autoFocus
          />
          
          {/* 搜索结果下拉列表 */}
          {searchResults.length > 0 && (
            <div className="absolute left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg z-10 max-h-60 overflow-auto">
              {searchResults.map((result, index) => (
                <button
                  key={result.id}
                  onClick={() => handleSelectTag(result)}
                  className={`w-full px-4 py-2 text-left hover:bg-gray-100 ${
                    index === selectedIndex ? 'bg-blue-50' : ''
                  }`}
                >
                  {result.name}
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200"
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