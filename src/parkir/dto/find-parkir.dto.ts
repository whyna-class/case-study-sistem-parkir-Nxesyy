import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { Type } from "class-transformer";
import { jenisKendaraan } from "@prisma/client";

export class FindParkirDto {
    @IsOptional ()
    @IsString()
    search: string

    @IsOptional ()
    @Type(() => Number)
    @IsNumber()
    page: number

    @IsOptional ()
    @Type(() => Number)
    @IsNumber()
    limit: number    

    @IsOptional ()
    @IsEnum(jenisKendaraan)
    jenisKendaraan: jenisKendaraan
}