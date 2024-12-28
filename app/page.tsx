import BaseLayout from './components/layout/BaseLayout';
import MediaGrid from './components/features/media/MediaGrid';
import AddMediaButton from './components/features/media/AddMediaButton';
import prisma from '@/lib/prisma';
import MediaCard from './components/features/media/MediaCard';

export default async function Home() {
  const media = await prisma.media.findMany();
  console.log('Fetched media from database:', media);

  return (
    <BaseLayout>
      <div className="max-w-7xl mx-auto">
        <MediaGrid media={media} />
      </div>
      <AddMediaButton />
    </BaseLayout>
  );
} 