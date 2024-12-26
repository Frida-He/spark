import { Media } from '../../../../types';

interface MediaCardProps {
  media: Media;
}

export default function MediaCard({ media }: MediaCardProps) {
  return (
    <div className="rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white">
      <div className="aspect-w-16 aspect-h-9 bg-gray-100">
        {media.type === 'image' ? (
          <img
            src={media.filePath}
            alt={media.fileName}
            className="object-cover w-full h-full"
          />
        ) : (
          <video
            src={media.filePath}
            className="object-cover w-full h-full"
            controls
          />
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-sm font-medium text-gray-900 truncate">
          {media.fileName}
        </h3>
        
        <p className="mt-1 text-sm text-gray-500">
          生成工具: {media.aiTool}
        </p>
        
        <div className="mt-2 flex flex-wrap gap-2">
          {media.tags.map(tag => (
            <span
              key={tag.id}
              className="px-2 py-1 text-xs bg-gray-100 rounded-full text-gray-600"
            >
              {tag.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
} 