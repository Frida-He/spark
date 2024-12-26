import { default as MediaCard } from './MediaCard';
import { mediaOperations } from '../../../../lib/db';

export default async function MediaGrid() {
  try {
    const mediaItems = await mediaOperations.getAllMedia();

    if (!mediaItems || mediaItems.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
          <p className="text-lg">暂无内容</p>
          <p className="text-sm mt-2">请添加一些 AI 生成的图片或视频</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {mediaItems.map(media => (
          <MediaCard key={media.id} media={media} />
        ))}
      </div>
    );
  } catch (error) {
    return (
      <div className="flex items-center justify-center h-64 text-red-500">
        <p>加载内容时出错</p>
      </div>
    );
  }
} 