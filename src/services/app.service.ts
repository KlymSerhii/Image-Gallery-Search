import { Injectable } from '@nestjs/common';
import { ImagesService } from './images.service';
import { refresh_interval } from '../config.json';
import { MainHttpService } from './mainHttp.service';

@Injectable()
export class AppService {
  constructor(
    private mainHttpService: MainHttpService,
    private imagesService: ImagesService,
  ) {
    // authenticates and retrieves all images on initialization
    this.loadAndCacheImages();
  }

  async loadAndCacheImages(): Promise<void> {
    await this.mainHttpService.authenticate();
    await this.loadImagesWithTimer();
  }

  async loadImagesWithTimer(): Promise<void> {
    await this.imagesService.getAllImages();
    setTimeout(() => this.loadImagesWithTimer(), refresh_interval);
  }
}
