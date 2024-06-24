import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ImageUploadService } from './image-upload.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Public } from '../authentication/strategy/public-strategy';

@Public()
@Controller('image-upload')
export class ImageUploadController {
  constructor(private readonly imageUploadService: ImageUploadService) {}

  @Post('upload-file')
  @UseInterceptors(FilesInterceptor('files'))
  createStore(@UploadedFiles() files: Array<Express.Multer.File>) {
    return this.imageUploadService.uploadImages(files);
  }
}
