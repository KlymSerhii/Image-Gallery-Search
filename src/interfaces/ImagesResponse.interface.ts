import { ImageBriefInfoInterface } from './ImageBriefInfo.interface';

export interface ImagesResponseInterface {
  pictures: ImageBriefInfoInterface[];
  page: number;
  pageCount: number;
  hasMore: boolean;
}
