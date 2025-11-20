import { PartialType } from '@nestjs/mapped-types';
import { CreateParkirDto } from './create-parkir.dto';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { jenisKendaraan } from '@prisma/client';

export class UpdateParkirDto extends PartialType(CreateParkirDto) {

    @IsOptional()
    @IsString()
    platnomor: string;

    @IsOptional()
    @IsString()
    jenisKendaraan: jenisKendaraan;

    @IsOptional()
    @IsNumber()
    durasi: number;
}
