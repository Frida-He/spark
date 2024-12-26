'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface AddMediaFormProps {
  onClose: () => void;
}

export default function AddMediaForm({ onClose }: AddMediaFormProps) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [title, setTitle] = useState('');
  const [aiTool, setAiTool] = useState('');
  const [prompt, setPrompt] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // 预设的 AI 工具选项
  const aiTools = ['MidJourney', 'DALL-E', 'Stable Diffusion'];
  
  // 预设的标签选项
  const tags = ['人物', '风景', '动物', '建筑'];

  // 处理文件选择
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      // 创建预览 URL
      const url = URL.createObjectURL(selectedFile);
      setPreview(url);
    }
  };

  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file || !title || !aiTool || !prompt) {
      alert('请填写所有必填项');
      return;
    }

    try {
      // TODO: 实现文件上传和表单提交逻辑
      
      // 刷新页面显示新内容
      router.refresh();
      
      // 关闭模态框
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('提交失败，请重试');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 文件上传区域 */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          上传文件 *
        </label>
        <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
          <div className="space-y-1 text-center">
            {preview ? (
              <div className="relative w-full aspect-video">
                <img
                  src={preview}
                  alt="Preview"
                  className="rounded-lg object-contain w-full h-full"
                />
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
              type="file"
              className="sr-only"
              accept="image/*,video/*"
              onChange={handleFileChange}
              required
            />
          </div>
        </div>
      </div>

      {/* 标题 */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          标题 *
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      {/* AI 工具选择 */}
      <div>
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
      <div>
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

      {/* 标签选择 */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          标签
        </label>
        <div className="mt-2 space-x-2">
          {tags.map((tag) => (
            <label key={tag} className="inline-flex items-center mr-4">
              <input
                type="checkbox"
                value={tag}
                checked={selectedTags.includes(tag)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedTags([...selectedTags, tag]);
                  } else {
                    setSelectedTags(selectedTags.filter(t => t !== tag));
                  }
                }}
                className="text-blue-500 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">{tag}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 日期选择 */}
      <div>
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

      {/* 按钮组 */}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          取消
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-500 border border-transparent rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          确认
        </button>
      </div>
    </form>
  );
} 