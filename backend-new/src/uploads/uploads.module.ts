import { Module } from '@nestjs/common';
import { UploadController } from './uploads.controller';
import { UploadService } from './uploads.service';
import { TestModule } from 'src/tests/test.module';
import {
  MockTest,
  MockTestSchema,
  Question,
  QuestionSchema,
  Test,
  TestSchema,
} from 'src/tests/schemas/tests.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  controllers: [UploadController],
  providers: [UploadService],

  imports: [
    MongooseModule.forFeature([
      { name: Test.name, schema: TestSchema },
      { name: MockTest.name, schema: MockTestSchema },
      { name: Question.name, schema: QuestionSchema },
    ]),
    TestModule,
  ],
})
export class UploadsModule {}
