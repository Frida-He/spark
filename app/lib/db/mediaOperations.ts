import { Prisma } from '@prisma/client';
import prisma from '@/lib/prisma';

export const mediaOperations = {
  async getAllMedia(options?: Prisma.MediaFindManyArgs) {
    return prisma.media.findMany({
      ...options,
      orderBy: {
        createdAt: Prisma.SortOrder.desc
      },
      include: {
        tags: true,
        ...options?.include,
      },
    });
  },
  // ... other operations
};