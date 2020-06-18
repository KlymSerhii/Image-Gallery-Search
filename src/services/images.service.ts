import { Injectable } from '@nestjs/common';
import { MainHttpService } from './mainHttp.service';
import { ImagesResponseInterface } from '../interfaces/ImagesResponse.interface';
import { ImageFullInfoInterface } from '../interfaces/ImageFullInfo.interface';
import { ImageBriefInfoInterface } from '../interfaces/ImageBriefInfo.interface';

@Injectable()
export class ImagesService {
  allImages: ImageFullInfoInterface[] = [];

  constructor(private httpService: MainHttpService) {}

  async getAllImages(): Promise<void> {
    const allImagesBriefInfo = await this.getAllImagesBriefInfo([]);
    this.allImages = await this.getAllImagesDetails(allImagesBriefInfo);
    console.log('Images successfully cached');
  }

  async getAllImagesBriefInfo(
    accumulator: ImageBriefInfoInterface[],
    page = 1,
  ): Promise<ImageBriefInfoInterface[]> {
    // I believe it is better not to use Promise.all for retrieving all pages at the same time after retrieving the first bunch of photos (where we get `pageCount`),
    // because on n-th request (for example on 10-th request) pageCount may be changed (as I don't know how AE api behaves).
    // That's why I'll be depending on `hasMore` property and retrieve each page one by one.
    // Also, I know that recursion is not the best approach, but I really like it in this particular case

    const response = await this.httpService.get<ImagesResponseInterface>(
      'images',
      { page },
    );

    accumulator.push(...response.pictures);

    if (response.hasMore) {
      return await this.getAllImagesBriefInfo(accumulator, page + 1);
    } else {
      return accumulator;
    }
  }

  async getAllImagesDetails(
    images: ImageBriefInfoInterface[],
  ): Promise<ImageFullInfoInterface[]> {
    return Promise.all(images.map(image => this.getImageDetails(image))); // anonymous arrow function has to be used in order to save `this`
  }

  async getImageDetails(
    image: ImageFullInfoInterface,
  ): Promise<ImageFullInfoInterface> {
    return this.httpService.get<ImageFullInfoInterface>(`images/${image.id}`);
  }

  search(searchTerm: string): ImageFullInfoInterface[] {
    // It is very hard to implement an appropriate search without knowing more details.
    // For example, which properties should I compare (only author, camera and tags or all existing properties).
    // Or should I apply `toLowerCase' or no?
    // Also, I need to know if searchTerm is always one word or maybe few words. If few words, then should I look
    // for exact match or "at least one word should match".
    // Below you will see a few examples of search implementation.

    // First approach, the simplest one
    // return this.allImages.filter(image => {
    //   const stringToCheck = Object.values(image).join(' ');
    //   return stringToCheck.includes(searchTerm);
    // });
    // End of first approach

    // Second approach, with more logic
    const smartSearchTerms = searchTerm.toLowerCase().split(' ');
    return this.allImages.filter(image => {
      const stringToCheck = `${image.author} ${image.camera} ${image.tags}`.toLowerCase();
      // Also, I thought about generating and saving `stringToCheck` at the moment when all images are cached
      // (so each item of this.allImages would have `stringToCheck` property) and as a result
      // there would be no need to generate it on each search request. But this approach should be
      // tested and compared to the current one. And there is no time to do it right now.
      return smartSearchTerms.some(term => stringToCheck.includes(term));
    });
    // End of second approach
  }
}
