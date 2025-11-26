import { IsUUID, IsString, IsOptional, Length } from "class-validator";

export class CreateCategoryDto {
  @IsUUID()
  restaurantId!: string;

  @IsString()
  @Length(1, 150)
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateCategoryDto {
  @IsOptional()
  @IsString()
  @Length(1, 150)
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
