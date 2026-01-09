import { Module } from '@nestjs/common';
import { TestService } from './test.service';
import { TestController } from './test.controller';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import {
  MockTest,
  MockTestSchema,
  Question,
  QuestionSchema,
  Test,
  TestSchema,
} from './schemas/tests.schema';

@Module({
  controllers: [TestController],
  providers: [TestService],
  imports: [
    MongooseModule.forFeature([
      { name: Test.name, schema: TestSchema },
      { name: MockTest.name, schema: MockTestSchema },
      { name: Question.name, schema: QuestionSchema },
    ]),
    AuthModule,
    UsersModule,
  ],
  exports: [TestService, TestController],
})
export class TestModule {}
