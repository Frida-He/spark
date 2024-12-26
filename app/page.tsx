import BaseLayout from './components/layout/BaseLayout';
import MediaGrid from './components/features/media/MediaGrid';
import AddMediaButton from './components/features/media/AddMediaButton';

export default function Home() {
  return (
    <BaseLayout>
      <div className="max-w-7xl mx-auto">
        <MediaGrid />
      </div>
      <AddMediaButton />
    </BaseLayout>
  );
} 