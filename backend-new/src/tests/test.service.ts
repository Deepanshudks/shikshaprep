import { Injectable, StreamableFile } from '@nestjs/common';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';
import { Model, Types } from 'mongoose';
import * as fs from 'fs';

import {
  MockTest,
  MockTestDocument,
  Question,
  Test,
  TestDocument,
} from './schemas/tests.schema';
import { InjectModel } from '@nestjs/mongoose';
import { TestResponseDto } from './dto/fomatted-test-dto';
import path from 'path';

@Injectable()
export class TestService {
  constructor(
    @InjectModel(MockTest.name) private readonly mockTestModel: Model<MockTest>,
    @InjectModel(Test.name) private readonly testModel: Model<TestDocument>,
    @InjectModel(Question.name) private readonly questionModel: Model<Question>,
  ) {}

  async findAll(id: Types.ObjectId) {
    try {
      const test: MockTestDocument[] = await this.mockTestModel
        .find({ userId: id })
        .sort({
          createdAt: -1,
        });
      const formattedTests = await test.map((test: MockTestDocument) => ({
        _id: test._id.toString(),
        name: test.name,
        originalFileName: test.originalFileName,
        questions: Array.isArray(test.questions) ? test.questions.length : 0,
        status: test.status,
        createdAt: test.createdAt,
        lastTaken: test.lastTaken,
        score: test.score,
      }));
      return { tests: formattedTests };
    } catch (error) {
      console.error('Error fetching tests:', error);
      return { error: 'Failed to fetch tests' };
    }
  }

  async findOne(id: string, userId: Types.ObjectId) {
    try {
      const test = await this.mockTestModel.findById({
        _id: id,
        userId,
      });
      if (!test) {
        return { error: 'Test not found' };
      }
      return {
        id: test._id.toString(),
        name: test.name,
        duration: test.duration,
        questions: test.questions,
      };
    } catch (error) {
      console.error('Error fetching test:', error);
      return { error: 'Failed to fetch test' };
    }
  }

  async remove(id: string, userId: Types.ObjectId) {
    try {
      const test = await this.mockTestModel.findByIdAndDelete({
        _id: id,
        userId,
      });
      if (!test) {
        return { error: 'Test not found' };
      }
      if (fs.existsSync(test.filePath)) {
        fs.unlinkSync(test.filePath);
      }
      return { message: 'Test deleted successfully' };
    } catch (error) {
      console.error('Error deleting test:', error);
      return { error: 'Failed to delete test' };
    }
  }

  async download(id: string, userId: Types.ObjectId) {
    try {
      const test = await this.mockTestModel.findOne({
        _id: id,
        userId,
      });
      if (!test) {
        return { error: 'Test not found' };
      }
      if (test.status !== 'completed') {
        return { error: 'Test is not ready for download' };
      }
      const filePath =
        test.filePath ||
        path.join(__dirname, `../files/mocktest-${test._id}.pdf`);

      if (!fs.existsSync(filePath)) {
        return { error: 'File not found' };
      }

      return new StreamableFile(fs.createReadStream(filePath), {
        type: 'application/pdf',
        disposition: `attachment; filename="${
          test.originalFileName || 'Test'
        }"`,
      });
    } catch (error) {
      console.error('Error downloading test:', error);
      return { error: 'Failed to download test' };
    }
  }

  async submit(id: string, userId: Types.ObjectId, answers: any) {
    try {
      const test = await this.mockTestModel.findOne({
        _id: id,
        userId,
      });
      if (!test) {
        return { error: 'Test not found' };
      }
      if (test.status !== 'processing') {
        return { error: 'Test is not ready for submission' };
      }

      let correctAnswers = 0;
      const results = test.questions.map((question, index) => {
        const userAnswer = answers[index];
        const isCorrect = userAnswer === question.correctAnswer;
        if (isCorrect) correctAnswers++;

        return {
          question: question.question,
          userAnswer,
          correctAnswer: question.correctAnswer,
          isCorrect,
          explanation: question.explanation,
        };
      });

      const score = Math.round((correctAnswers / test.questions.length) * 100);

      test.score = score;
      test.lastTaken = new Date();
      await test.save();

      return {
        score,
        correctAnswers,
        totalQuestions: test.questions.length,
        results,
      };
    } catch (error) {
      console.error('Error submitting test:', error);
      return { error: 'Failed to submit test' };
    }
  }
}
