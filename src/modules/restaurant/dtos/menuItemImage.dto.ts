import { IsUUID, IsString, IsOptional, IsBoolean, IsUrl } from "class-validator";

export class CreateMenuItemImageDto {
  @IsUUID()
  menuItemId!: string;

  @IsUrl()
  url!: string;

  @IsOptional()
  @IsString()
  altText?: string;

  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;
}

export class UpdateMenuItemImageDto {
    @IsOptional()
    @IsUrl()
    url?: string;

    @IsOptional()
    @IsString()
    altText?: string;

    @IsOptional()
    @IsBoolean()
    isPrimary?: boolean;
}