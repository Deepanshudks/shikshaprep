import { ApiProperty } from '@nestjs/swagger';

export class TestResponseDto {
  @ApiProperty({
    example: '65a1f9b9c1234567890abcd',
    description: 'Test ID',
  })
  _id: string;

  @ApiProperty({
    example: 'Math Practice Test',
    description: 'Test name',
  })
  name: string;

  @ApiProperty({
    example: 'math_test.pdf',
    description: 'Original uploaded file name',
  })
  originalFileName: string;

  @ApiProperty({
    example: 20,
    description: 'Number of questions in the test',
  })
  questions: number;

  @ApiProperty({
    example: 'completed',
    description: 'Current test status',
  })
  status: string;

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'Test creation date',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2024-01-05T00:00:00.000Z',
    description: 'Last time the test was taken',
    required: false,
  })
  lastTaken?: Date;

  @ApiProperty({
    example: 85,
    description: 'Test score',
    required: false,
  })
  score?: number;
}
