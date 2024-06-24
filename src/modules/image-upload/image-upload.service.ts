import { BadRequestException, Injectable } from '@nestjs/common';
import { DigitalOceanService } from '../../libs/uploads/digitalOcean/digital_ocean.service';
import { BaseResponse } from '../../libs/response/base_response';

@Injectable()
export class ImageUploadService {
  constructor(private readonly digitalOcean: DigitalOceanService) {}

  async uploadImages(files: Array<Express.Multer.File>) {
    const imageUrl = [];
    for (const file of files) {
      try {
        const image = await this.digitalOcean.uploadFile(
          file.buffer,
          file.originalname,
        );
        imageUrl.push(image);
      } catch (error) {
        console.log(error);
        throw new BadRequestException('Invalid file type.');
      }
    }
    return BaseResponse.success(imageUrl, 'Images uploaded successfully', 200);
  }
}
