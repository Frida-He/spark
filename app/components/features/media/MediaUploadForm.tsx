'use client';

import { useState } from 'react';

interface MediaUploadFormProps {
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
}

export default function MediaUploadForm({ onSubmit, onCancel }: MediaUploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [title, setTitle] = useState('');
  const [aiTool, setAiTool] = useState('');
  const [prompt, setPrompt] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const aiTools = ['MidJourney', 'DALL-E', 'Stable Diffusion'];
  const tags = ['人物', '风景', '动物', '建筑'];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title || !aiTool || !prompt) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('aiTool', aiTool);
    formData.append('prompt', prompt);
    formData.append('tags', JSON.stringify(selectedTags));

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="p-6">
      <h2 className="text-xl font-semibold mb-4">添加新内容</h2>
      
      {/* 文件上传 */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          上传文件
        </label>
        <input
          type="file"
          accept="image/*,video/*"
          onChange={handleFileChange}
          className="w-full"
          required
        />
        {preview && (
          <div className="mt-2 aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg overflow-hidden">
            <img src={preview} alt="预览" className="object-contain" />
          </div>
        )}
      </div>

      {/* 标题 */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          标题
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      {/* AI 工具 */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          AI 生成工具
        </label>
        <select
          value={aiTool}
          onChange={(e) => setAiTool(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">请选择</option>
          {aiTools.map(tool => (
            <option key={tool} value={tool}>
              {tool}
            </option>
          ))}
        </select>
      </div>

      {/* Prompt */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Prompt
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          maxLength={1000}
          rows={4}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      {/* 标签 */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          标签
        </label>
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <label key={tag} className="inline-flex items-center">
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
                className="mr-2"
              />
              <span>{tag}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 按钮 */}
      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-600 hover:text-gray-800"
        >
          取消
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          确认
        </button>
      </div>
    </form>
  );
}
