interface HeaderProps {
  className?: string;
}

export default function Header({ className = '' }: HeaderProps) {
  return (
    <header className={`relative h-48 w-full ${className}`}>
      {/* 背景图 */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600">
        <div className="absolute inset-0 bg-black/20" />
      </div>
      
      {/* Logo 和标题 */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
        <h1 className="text-6xl font-bold tracking-tight">SPARK</h1>
        <p className="mt-2 text-lg font-medium">AI 生成内容管理工具</p>
      </div>
    </header>
  );
} 