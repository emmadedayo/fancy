import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class DigitalOceanService {
  private s3: AWS.S3;
  constructor() {
    this.s3 = new AWS.S3({
      endpoint: 'https://nyc3.digitaloceanspaces.com',
      accessKeyId: 'DO00H76LGD4FKU4TPL8C',
      secretAccessKey: '8nd4EnBNUDLX4IlPgNY6YkxzFcd2Lacjbo10HUE6eJM',
      region: 'nyc3',
    });
  }

  async uploadFile(buffer: Buffer, originalFilename: string): Promise<string> {
    const extension = originalFilename.split('.').pop()?.toLowerCase() ?? '';
    const filename = `${uuidv4()}.${extension}`;
    let contentType = 'application/octet-stream'; // Default content type
    if (extension) {
      contentType = this.getContentTypeFromExtension(extension);
    }

    const params: AWS.S3.PutObjectRequest = {
      Bucket: 'fanzty',
      Key: filename,
      Body: buffer,
      ACL: 'public-read',
      ContentType: contentType,
      // CacheControl is removed, assuming no default caching behavior is desired
    };

    const Location = await this.s3.upload(params).promise();
    const fileUrl = Location.Location;
    //remove https:// from the url
    const removeUrl = fileUrl.replace(/^https?:\/\//, '');
    return 'https://' + removeUrl;
  }

  getContentTypeFromExtension(extension: string): string {
    const contentTypes: { [key: string]: string } = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      gif: 'image/gif',
      mp4: 'video/mp4',
      mov: 'video/quicktime',
      avi: 'video/x-msvideo',
      mkv: 'video/x-matroska',
      webm: 'video/webm',
      // Add other content types as needed
    };
    return contentTypes[extension] || 'application/octet-stream';
  }
}
