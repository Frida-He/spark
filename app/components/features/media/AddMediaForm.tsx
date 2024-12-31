'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import TagManager from '../tags/TagManager';

interface AddMediaFormProps {
  onClose: () => void;
}

// 确保与 TagManager 组件中的 Tag 接口定义一致
interface Tag {
  id: string;
  name: string;
}

// 获取当前日期的 YYYY-MM-DD 格式
const getCurrentDate = () => {
  const now = new Date();
  return now.toISOString().split('T')[0];
};

export default function AddMediaForm({ onClose }: AddMediaFormProps) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [aiTool, setAiTool] = useState('');
  const [prompt, setPrompt] = useState('');
  const [date, setDate] = useState(getCurrentDate()); // 设置默认日期为当前日期
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // 预设的 AI 工具选项
  const aiTools = ['MidJourney', 'DALL-E', 'Stable Diffusion'];

  // 处理文件选择
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // 验证文件类型
      if (!selectedFile.type.startsWith('image/') && !selectedFile.type.startsWith('video/')) {
        setError('请上传图片或视频文件');
        return;
      }
      
      setFile(selectedFile);
      // 创建预览 URL
      const url = URL.createObjectURL(selectedFile);
      setPreview(url);
      setError('');
    }
  };

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
      setSelectedTags(prev => [...prev, newTag]);
    } catch (error) {
      console.error('添加标签失败:', error);
      setError('添加标签失败');
    }
  };

  // 处理删除标签
  const handleRemoveTag = async (tagId: string): Promise<void> => {
    setSelectedTags(prev => prev.filter(tag => tag.id !== tagId));
  };

  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file || !aiTool || !prompt) {
      setError('请填写所有必填项');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');

      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileName', file.name);
      formData.append('type', file.type.startsWith('image/') ? 'image' : 'video');
      formData.append('aiTool', aiTool);
      formData.append('prompt', prompt);
      formData.append('date', date);
      formData.append('tags', JSON.stringify(selectedTags.map(tag => tag.id)));

      const response = await fetch('/api/media', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '上传失败');
      }

      router.refresh();
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
      setError(error instanceof Error ? error.message : '上传失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="h-[80vh] flex flex-col">
      {error && (
        <div className="text-red-500 text-sm px-6 pt-4">{error}</div>
      )}

      {/* 可滚动的内容区域 */}
      <div className="flex-1 overflow-y-auto px-6 pb-20">
        {/* 文件上传区域 */}
        <div className="space-y-2 my-6">
          <label className="block text-sm font-medium text-gray-700">
            上传文件 *
          </label>
          <div 
            className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer"
            onClick={() => document.getElementById('file-upload')?.click()}
          >
            <div className="space-y-1 text-center">
              {preview ? (
                <div className="relative max-h-[300px] w-full">
                  {file?.type.startsWith('image/') ? (
                    <img
                      src={preview}
                      alt="Preview"
                      className="rounded-lg object-contain w-full h-full max-h-[300px]"
                    />
                  ) : (
                    <video
                      src={preview}
                      className="rounded-lg object-contain w-full h-full max-h-[300px]"
                      controls
                    />
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <svg className="w-12 h-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <p className="text-sm text-gray-600">
                    点击或拖拽文件到这里上传
                  </p>
                  <p className="text-xs text-gray-500">
                    支持 PNG, JPG, GIF, MP4 格式
                  </p>
                </div>
              )}
              <input
                id="file-upload"
                type="file"
                className="sr-only"
                accept="image/*,video/*"
                onChange={handleFileChange}
                required
              />
            </div>
          </div>
        </div>

        {/* AI 工具选择 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">
            AI 生成工具 *
          </label>
          <div className="mt-2 space-y-2">
            {aiTools.map((tool) => (
              <label key={tool} className="inline-flex items-center mr-4">
                <input
                  type="radio"
                  name="aiTool"
                  value={tool}
                  checked={aiTool === tool}
                  onChange={(e) => setAiTool(e.target.value)}
                  className="text-blue-500 focus:ring-blue-500"
                  required
                />
                <span className="ml-2 text-sm text-gray-700">{tool}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Prompt */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">
            Prompt * <span className="text-xs text-gray-500">（最多1000字符）</span>
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            maxLength={1000}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        {/* 日期选择 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">
            日期
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {/* 标签管理 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            标签
          </label>
          <TagManager
            tags={selectedTags}
            onAddTag={handleAddTag}
            onRemoveTag={handleRemoveTag}
            preventFormSubmit={true} // 添加新属性，防止表单提交
          />
        </div>
      </div>

      {/* 底部固定的按钮 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white px-6 py-4 border-t border-gray-200">
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            disabled={isSubmitting}
          >
            取消
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-500 border border-transparent rounded-md hover:bg-blue-600 disabled:bg-blue-300"
            disabled={isSubmitting}
          >
            {isSubmitting ? '上传中...' : '确认'}
          </button>
        </div>
      </div>
    </form>
  );
} 