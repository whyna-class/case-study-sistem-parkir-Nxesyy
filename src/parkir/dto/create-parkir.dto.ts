import { IsNotEmpty, IsNumber, IsString, Min } from "class-validator";
import { jenisKendaraan } from "@prisma/client"

export class CreateParkirDto {
    @IsNotEmpty()
    @IsString()
    platNomor: string;

    @IsNotEmpty()
    @IsString()
    jenisKendaraan: jenisKendaraan;

    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    durasi: number;
}
