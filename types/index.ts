// 媒体文件类型
export type MediaType = 'image' | 'video';

// 媒体文件接口
export interface Media {
  id: string;
  fileName: string;
  filePath: string;
  type: 'image' | 'video';
  aiTool: string;
  tags: Tag[];
  createdAt: Date;
  updatedAt: Date;
}

// 标签接口
export interface Tag {
  id: string;
  name: string;
}

// AI 工具类型
export type AITool = 'MidJourney' | 'DALL-E' | 'Stable Diffusion'; 