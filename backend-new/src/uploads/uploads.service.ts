import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { processPDF } from './utils/pdf-processor';
import { MockTest, MockTestDocument } from 'src/tests/schemas/tests.schema';

@Injectable()
export class UploadService {
  constructor(
    @InjectModel(MockTest.name)
    private readonly mockTestModel: Model<MockTestDocument>,
  ) {}

  async handlePdfUpload({
    userId,
    originalFileName,
    filePath,
  }: {
    userId: Types.ObjectId;
    originalFileName: string;
    filePath: string;
  }) {
    try {
      const newMockTest = await this.mockTestModel.create({
        userId,
        name: `Test from ${originalFileName}`,
        originalFileName,
        filePath,
        status: 'processing',
        questions: [],
      });

      // 🔥 Background processing (DO NOT await)
      processPDF(newMockTest._id, filePath)
        .then(() =>
          console.log(
            `Background PDF processing started for test ${newMockTest._id}`,
          ),
        )
        .catch((err) =>
          console.error(
            `Error processing PDF for test ${newMockTest._id}:`,
            err,
          ),
        );

      return {
        message: 'PDF uploaded and processing started.',
        testId: newMockTest._id,
        fileName: originalFileName,
        name: newMockTest.name,
        originalFileName: newMockTest.originalFileName,
        status: newMockTest.status,
        createdAt: newMockTest.createdAt,
      };
    } catch (error) {
      console.error('Error uploading PDF:', error);
      throw new InternalServerErrorException(
        'Failed to upload PDF and start processing',
      );
    }
  }
}
