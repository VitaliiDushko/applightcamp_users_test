import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class UserCreateDto {
  @IsString()
  @IsNotEmpty({ message: 'Name should not be empty' })
  @Length(1, 255, { message: 'Name must be at least 1 character long' })
  name: string;

  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Phone number is required' })
  @Matches(/^\+?[1-9]\d{1,14}$/, {
    message: 'Phone number must be a valid phone number',
  })
  phone_number: string;
}
