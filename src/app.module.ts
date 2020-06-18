import { HttpModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './services/app.service';
import { MainHttpService } from './services/mainHttp.service';
import { ImagesService } from './services/images.service';

@Module({
  imports: [HttpModule],
  controllers: [AppController],
  providers: [AppService, MainHttpService, ImagesService],
})
export class AppModule {}
