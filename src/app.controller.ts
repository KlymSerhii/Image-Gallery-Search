import { Controller, Get, Param } from '@nestjs/common';
import { ImagesService } from './services/images.service';
import { ImageFullInfoInterface } from './interfaces/ImageFullInfo.interface';

@Controller('search')
export class AppController {
  constructor(private readonly imagesService: ImagesService) {}

  @Get(':searchTerm')
  searchImages(
    @Param('searchTerm') searchTerm: string,
  ): ImageFullInfoInterface[] {
    return this.imagesService.search(searchTerm);
  }
}
