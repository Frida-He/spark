'use client';

import MediaCard from './MediaCard';
import { Media } from '@prisma/client';

interface MediaGridProps {
  media: Media[];
}

export default function MediaGrid({ media }: MediaGridProps) {
  console.log('MediaGrid received media:', media);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
      {media?.map((item) => {
        console.log('Rendering MediaCard with:', item);
        
        // 确保 type 是正确的类型
        const type = item.type.toLowerCase();
        if (type !== 'image' && type !== 'video') {
          console.error('Invalid media type:', type);
          return null; // 跳过无效类型的媒体
        }

        return (
          <MediaCard
            key={item.id}
            {...item}
            type={type as 'image' | 'video'} // 类型断言
          />
        );
      })}
    </div>
  );
} 