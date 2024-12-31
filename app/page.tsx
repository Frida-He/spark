import { mediaOperations } from '@/lib/db';
import { Prisma } from '@prisma/client';
import ClientPage from './ClientPage';

export default async function Page() {
  const media = await mediaOperations.getAllMedia({
    orderBy: {
      createdAt: Prisma.SortOrder.desc
    }
  });
  
  return <ClientPage initialMedia={media} />;
}