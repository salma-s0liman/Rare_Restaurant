import {
  IsString,
  IsOptional,
  Length,
  IsBoolean,
  IsPhoneNumber,
} from "class-validator";

export class CreateRestaurantDto {
  @IsString()
  @Length(1, 200)
  name!: string;

  @IsOptional()
  @IsString()
  @Length(0, 30)
  @IsPhoneNumber()
  phone?: string;

  @IsOptional()
  @IsString()
  @Length(0, 255)
  address?: string;

  @IsOptional()
  @IsString()
  currency?: string;
}

export class UpdateRestaurantDto {
  @IsOptional()
  @IsString()
  @Length(1, 200)
  name?: string;

  @IsOptional()
  @IsString()
  @Length(0, 30)
  phone?: string;

  @IsOptional()
  @IsString()
  @Length(0, 255)
  address?: string;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
