import { Module } from '@nestjs/common';
import { ImageUploadService } from './image-upload.service';
import { ImageUploadController } from './image-upload.controller';
import { DigitalOceanService } from '../../libs/uploads/digitalOcean/digital_ocean.service';

@Module({
  controllers: [ImageUploadController],
  providers: [ImageUploadService, DigitalOceanService],
})
export class ImageUploadModule {}
