// create-order.dto.ts
import {
  IsUUID,
  IsOptional,
  ValidateNested,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsString,
  Length,
} from "class-validator";
import { Type } from "class-transformer";
import { CreateOrderItemDto } from "./orderItem.dto";

export class CreateOrderDto {
  @IsUUID("4", { message: "restaurantId must be a valid UUID" })
  restaurantId!: string;

  @IsOptional()
  @IsUUID("4", { message: "addressId must be a valid UUID" })
  addressId?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  @ArrayMinSize(1, { message: "At least one order item is required" })
  items!: CreateOrderItemDto[];

  @IsOptional()
  @IsString()
  @Length(0, 500)
  notes?: string;

  @IsOptional()
  @IsBoolean()
  isPrepaid?: boolean;
}
