import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  GUEST = 'guest',
}

export class CreateUserDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'User email address',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'strongPassword123',
    minLength: 6,
    writeOnly: true,
    description: 'User password',
  })
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({
    example: 'john_doe',
    minLength: 3,
    description: 'Unique username',
  })
  @IsNotEmpty()
  @MinLength(3)
  username: string;

  @ApiPropertyOptional({
    enum: UserRole,
    enumName: 'UserRole',
    example: UserRole.USER,
    description: 'User role (optional)',
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}

export class SignUserDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Registered email address',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'strongPassword123',
    minLength: 6,
    writeOnly: true,
    description: 'User password',
  })
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
