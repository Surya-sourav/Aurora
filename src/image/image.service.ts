import { Injectable } from '@nestjs/common';
import { ImageRepository } from './image.repository';

@Injectable()
export class ImageService {
  constructor(private readonly repo: ImageRepository) {}

  getBytes(id: string) {
    return this.repo.findWithBytes(id);
  }

  create(file: Express.Multer.File, alt_text: string, blog_id?: string) {
    return this.repo.create({
      data: file.buffer,
      mime_type: file.mimetype,
      size_bytes: file.size,
      alt_text,
      blog_id: blog_id ?? null,
    });
  }

  remove(id: string) {
    return this.repo.remove(id);
  }
}
