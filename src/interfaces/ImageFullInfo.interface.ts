import { ImageBriefInfoInterface } from './ImageBriefInfo.interface';

export interface ImageFullInfoInterface extends ImageBriefInfoInterface {
  author?: string;
  camera?: string;
  tags?: string;
  full_picture?: string;
}
