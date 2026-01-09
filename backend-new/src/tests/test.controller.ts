import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { TestService } from './test.service';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';
import {
  ApiBearerAuth,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/jwt-guard';

@Controller('api/tests/')
@ApiTags('Tests')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@ApiUnauthorizedResponse({ description: 'Invalid or expired token' })
export class TestController {
  constructor(private readonly testService: TestService) {}

  @Get()
  findAll(@Req() req) {
    const userId = req.user._id;
    return this.testService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    const userId = req.user._id;
    return this.testService.findOne(id, userId);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @Req() req) {
    const userId = req.user._id;

    return this.testService.remove(id, userId);
  }

  @Get(':id/download')
  download(@Param('id') id: string, @Req() req) {
    const userId = req.user._id;
    return this.testService.download(id, userId);
  }

  @Post(':id/submit')
  submit(@Param('id') id: string, @Req() req, @Body() submitTestDto) {
    const userId = req.user._id;
    return this.testService.submit(id, userId, submitTestDto.answers);
  }
}
