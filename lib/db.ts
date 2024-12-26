import prisma from './prisma';
import { Media, Tag } from '../types';
import { Prisma } from '@prisma/client';

// 媒体文件相关操作
export const mediaOperations = {
  // 获取所有媒体文件
  getAllMedia: async () => {
    try {
      const media = await prisma.media.findMany({
        include: {
          tags: true,
        },
      });
      return media;
    } catch (error) {
      console.error('Error fetching media:', error);
      return [];
    }
  },

  // 创建媒体文件
  createMedia: (data: Prisma.MediaCreateInput) => {
    return prisma.media.create({
      data,
      include: {
        tags: true,
      },
    });
  },

  // 根据ID获取媒体文件
  getMediaById: (id: string) => {
    return prisma.media.findUnique({
      where: { id },
      include: {
        tags: true,
      },
    });
  },

  // 删除媒体文件
  deleteMedia: (id: string) => {
    return prisma.media.delete({
      where: { id },
    });
  },
};

// 标签相关操作
export const tagOperations = {
  // 获取所有标签
  getAllTags: () => {
    return prisma.tag.findMany();
  },

  // 创��标签
  createTag: (name: string) => {
    return prisma.tag.create({
      data: { name },
    });
  },

  // 为媒体添加标签
  addTagToMedia: (mediaId: string, tagId: string) => {
    return prisma.media.update({
      where: { id: mediaId },
      data: {
        tags: {
          connect: { id: tagId },
        },
      },
    });
  },
}; 