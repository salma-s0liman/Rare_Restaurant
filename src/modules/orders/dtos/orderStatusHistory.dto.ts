// update-order-status.dto.ts
import { IsEnum, IsOptional, IsString, Length } from "class-validator";
import { orderStatusEnum } from "../../../common"; // your enums

export class UpdateOrderStatusDto {
  @IsEnum(orderStatusEnum, { message: "Invalid order status" })
  newStatus!: orderStatusEnum;

  @IsOptional()
  @IsString()
  @Length(0, 500)
  note?: string;
}
