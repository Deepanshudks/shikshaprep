import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  GUEST = 'guest',
}

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Unique user email address',
  })
  @Prop({ required: [true, 'Email is required'], unique: true })
  email: string;

  @ApiProperty({
    minLength: 6,
    writeOnly: true,
    description: 'User password (not returned in responses)',
  })
  @Prop({
    required: [true, 'Password is required'],
    minlength: 6,
    select: false,
  })
  password: string;

  @ApiProperty({
    type: Date,
    example: '2024-01-01T12:00:00.000Z',
  })
  @Prop({ default: Date.now })
  createdAt: Date;

  @ApiPropertyOptional({
    description: 'Reset password token',
  })
  resetPasswordToken?: string;

  @ApiPropertyOptional({
    type: Date,
    description: 'Reset password expiration date',
  })
  resetPasswordExpires?: Date;

  @ApiProperty({
    example: 'john_doe',
    description: 'Unique username',
  })
  @Prop({ required: [true, 'Username is required'], unique: true })
  username: string;

  @ApiProperty({
    enum: UserRole,
    enumName: 'UserRole',
    example: UserRole.USER,
  })
  @Prop({
    type: String,
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;
}

export const UserSchema = SchemaFactory.createForClass(User);
