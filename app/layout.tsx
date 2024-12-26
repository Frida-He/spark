import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI Spark',
  description: 'AI 生成内容管理工具',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh">
      <body>{children}</body>
    </html>
  )
}
