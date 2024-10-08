import {
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsPositive,
  IsString,
} from 'class-validator';

export class FindUsersQuery {
  @IsOptional()
  @IsString()
  name?: string;
  @IsOptional()
  @IsEmail({}, { message: 'Invalid email format' })
  email?: string;
  @IsOptional()
  @IsPhoneNumber(null, { message: 'Invalid phone number format' })
  phone_number?: number;
  @IsPositive()
  page?: number = 1;
  @IsPositive()
  limit?: number = 10;
}
