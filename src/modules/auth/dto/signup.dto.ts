import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, Length } from 'class-validator';
import { ESexOfHuman, ROLE } from 'src/config/constant';

export class signUpDTO {
  @ApiProperty()
  @Length(4, 64)
  @IsNotEmpty()
  userName: string;

  @Length(4, 64)
  @ApiProperty()
  @IsNotEmpty()
  passWord: string;

  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  dob: Date;

  @ApiProperty()
  @Length(4, 64)
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty()
  @IsOptional()
  avatarUrl: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(ROLE, { each: true })
  role: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(ESexOfHuman, { each: true })
  sex: string;

  @ApiProperty()
  @IsNotEmpty()
  idNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  address: string;

  @ApiProperty()
  @IsOptional()
  experience: string; //kinh nghiem

  @ApiProperty()
  @IsOptional()
  specialization: string; //chuyen mon

}

