import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument, Types } from 'mongoose';

export type MockTestDocument = HydratedDocument<MockTest>;

@Schema()
export class Question {
  @ApiProperty({ example: 'What is 2+2?', description: 'The question text' })
  @Prop({ required: true })
  question: string;

  @ApiProperty({
    example: ['1', '2', '3', '4'],
    description: 'Answer options',
    type: [String],
  })
  @Prop({ type: [String], default: [] })
  options: string[];

  @ApiProperty({ example: '4', description: 'Correct answer' })
  @Prop({ required: true })
  correctAnswer: string;

  @ApiProperty({
    example: 'mcq',
    description: 'Question type',
    enum: ['mcq', 'true-false', 'short-answer'],
    default: 'mcq',
  })
  @Prop({
    type: String,
    enum: ['mcq', 'true-false', 'short-answer'],
    default: 'mcq',
  })
  type: string;

  @ApiProperty({ example: 'Because 2+2=4', required: false })
  @Prop()
  explanation?: string;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);

@Schema({ timestamps: true })
export class MockTest {
  @ApiProperty({ example: 'Math Practice Test', description: 'Test name' })
  @Prop({ required: true })
  name: string;

  @ApiProperty({ example: 'math_test.pdf', description: 'Original file name' })
  @Prop({ required: true })
  originalFileName: string;

  @ApiProperty({ example: '/uploads/math_test.pdf', description: 'File path' })
  @Prop({ required: true })
  filePath: string;

  @ApiProperty({ example: '65a1f9b9c1234567890abcd', description: 'User ID' })
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @ApiProperty({ type: [Question], description: 'Questions array' })
  @Prop({ type: [QuestionSchema], default: [] })
  questions: Question[];

  @ApiProperty({
    example: 'processing',
    enum: ['processing', 'completed', 'failed'],
    description: 'Test status',
    default: 'processing',
  })
  @Prop({
    type: String,
    enum: ['processing', 'completed', 'failed'],
    default: 'processing',
  })
  status: string;

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'Last taken date',
    required: false,
  })
  @Prop({ type: Date, default: Date.now })
  createdAt?: Date;

  @ApiProperty({ required: false })
  @Prop()
  lastTaken?: Date;

  @ApiProperty({ required: false })
  @Prop()
  score?: number;

  @ApiProperty({ required: false })
  @Prop()
  processingError?: string;

  @ApiProperty({ required: false })
  @Prop()
  duration?: string;
}

export const MockTestSchema = SchemaFactory.createForClass(MockTest);

export type TestDocument = HydratedDocument<Test>;

@Schema({ timestamps: true })
export class Test {
  @ApiProperty({ example: 'Math Test', description: 'Test name' })
  @Prop({ required: true })
  testName: string;

  @ApiProperty({ example: 'math_test.pdf', description: 'Original file name' })
  @Prop()
  originalFileName: string;

  @ApiProperty({
    example: [{ question: 'Q1', answer: 'A1' }],
    description: 'Questions (array or string)',
  })
  @Prop({ type: Array, default: [] })
  questions: any[];

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'Creation date',
  })
  @Prop({ default: Date.now })
  createdAt: Date;
}

export const TestSchema = SchemaFactory.createForClass(Test);
