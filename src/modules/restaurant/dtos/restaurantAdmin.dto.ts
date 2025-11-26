import { IsUUID, IsString } from "class-validator";

export class CreateRestaurantAdminDto {
  @IsUUID()
  userId!: string;

  @IsUUID()
  restaurantId!: string;

  @IsString()
  role!: string; 
}

export class UpdateRestaurantAdminRoleDto {
  @IsString()
  role!: string; 
}