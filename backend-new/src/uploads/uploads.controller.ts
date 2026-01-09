import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/jwt-guard';
import { Request } from 'express';
import { Req } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { UploadService } from './uploads.service';

@ApiTags('Mock Tests')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('upload')
export class UploadController {
  constructor(private readonly mockTestService: UploadService) {}

  @Post('pdf')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('pdfFile', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadDir = path.join(process.cwd(), 'uploads');
          if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
          }
          cb(null, uploadDir);
        },
        filename: (req, file, cb) => {
          cb(null, `${Date.now()}-${file.originalname}`);
        },
      }),
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
      fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
          cb(null, true);
        } else {
          cb(new BadRequestException('Only PDF files are allowed!'), false);
        }
      },
    }),
  )
  async uploadPdf(@UploadedFile() file: Express.Multer.File, @Req() req) {
    if (!file) {
      throw new BadRequestException('No PDF file uploaded');
    }

    return this.mockTestService.handlePdfUpload({
      userId: req.user['_id'],
      originalFileName: file.originalname,
      filePath: file.path,
    });
  }
}
