interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className = '' }: SidebarProps) {
  return (
    <aside className={`p-6 bg-white shadow-sm ${className}`}>
      {/* 搜索框 */}
      <div className="mb-8">
        <input
          type="search"
          placeholder="搜索内容..."
          className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      
      {/* 筛选区域 */}
      <div className="space-y-8">
        {/* AI 工具筛选 */}
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-3">AI 工具</h3>
          <div className="space-y-3">
            {['MidJourney', 'DALL-E', 'Stable Diffusion'].map(tool => (
              <label key={tool} className="flex items-center">
                <input type="checkbox" className="w-4 h-4 rounded text-blue-500 border-gray-300 focus:ring-blue-500" />
                <span className="ml-3 text-sm text-gray-600">{tool}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 文件类型筛选 */}
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-3">文件类型</h3>
          <div className="space-y-3">
            {['图片', '视频'].map(type => (
              <label key={type} className="flex items-center">
                <input type="checkbox" className="w-4 h-4 rounded text-blue-500 border-gray-300 focus:ring-blue-500" />
                <span className="ml-3 text-sm text-gray-600">{type}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
} 