import { IsUUID, IsInt, Min, IsOptional, IsString, Length } from "class-validator";
import { Type } from "class-transformer";

export class CreateOrderItemDto {
    @IsUUID("4", { message: "menuItemId must be a valid UUID" })
    menuItemId!: string;

    @IsInt({ message: "quantity must be an integer" })
    @Min(1, { message: "quantity must be at least 1" })
    @Type(() => Number)
    quantity!: number;

    @IsInt({ message: "priceAtOrder must be an integer" })
    @Type(() => Number)
    price_at_order!: number;

    @IsOptional()
    @IsString()
    @Length(1, 200)
    itemNameSnapshot?: string;
}



