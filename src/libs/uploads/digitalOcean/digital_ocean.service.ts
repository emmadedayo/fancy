import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class DigitalOceanService {
  private s3: AWS.S3;
  constructor() {
    this.s3 = new AWS.S3({
      endpoint: 'https://nyc3.digitaloceanspaces.com',
      accessKeyId: 'DO009DTD8Z8BDHK7E46E',
      secretAccessKey: 'qYccbRbGC4ie++dLTB2t1L1mMivBd1RGTkEJLPN3lJg',
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
      Bucket: 'hubeatz',
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
