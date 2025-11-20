import { Injectable } from '@nestjs/common';
import { CreateParkirDto } from './dto/create-parkir.dto';
import { UpdateParkirDto } from './dto/update-parkir.dto';
import { PrismaService } from '../prisma/prisma.service';
import { FindParkirDto } from './dto/find-parkir.dto';

@Injectable()
export class ParkirService {
  constructor(private prisma: PrismaService) { }


  hitungTotal(jenis: string, durasi: number) {
    if (jenis === "roda2") {
      if (durasi === 1) return 3000;
      return 3000 + (durasi - 1) * 2000;
    }

    if (jenis === "roda4") {
      if (durasi === 1) return 6000;
      return 6000 + (durasi - 1) * 4000;
    }
    return 0;
  }

  async create(createParkirDto: CreateParkirDto) {
    try {
      const total = this.hitungTotal(createParkirDto.jenisKendaraan, createParkirDto.durasi);
      const { platNomor } = createParkirDto;
      const park = await this.prisma.parkir.create({
        data: {
          platNomor,
          jenisKendaraan: createParkirDto.jenisKendaraan,
          durasi: createParkirDto.durasi,
          total
        },
      })
      return {
        success: true,
        message: "Berhasil menambahkan data parkir",
        data: park
      }

    }
    catch (error) {
      return {
        success: false,
        message: `error menambahkan data parkir: ${error.message}`,
        park: null
      }
    }
  }

  async findAll(FindParkirDto: FindParkirDto) {
    try {
      const { search = "", jenisKendaraan, page = 1, limit = 10 } = FindParkirDto;
      const skip = (page - 1) * limit;

      const where: any = {}
      //Searching by platNomor
      if (search) {
        where.platNomor = { contains: search }
      }
      //Filtering by jenisKendaraan
      if (jenisKendaraan) {
        where.jenisKendaraan = jenisKendaraan
      }

      const parks = await this.prisma.parkir.findMany({
        where,
        skip,
        take: Number(limit)
      })
      return {
        success: true,
        message: "Berhasil mengambil semua data parkir",
        data: parks
      }
    } catch (error) {
      return {
        success: false,
        message: `error mengambil semua data parkir: ${error.message}`,
        parks: null

      }
    }
  }
  async findOne(id: number) {
    try {
      const park = await this.prisma.parkir.findFirst({ where: { id: id } });
      if (!park) {
        return {
          success: false,
          message: "Data parkir tidak ditemukan",
          data: null
        }
      }
      return {
        success: true,
        message: "Berhasil mengambil data parkir",
        data: park
      }
    } catch (error) {
      return {
        success: false,
        message: `error mengambil data parkir: ${error.message}`,
        park: null
      }
    }

  }

  async update(id: number, updateParkirDto: UpdateParkirDto) {
    try {
      const existingParkir = await this.prisma.parkir.findUnique({ where: { id } });
      if (!existingParkir) {
        return {
          success: false,
          message: "Data parkir tidak ditemukan",
          data: null
        }
      }
      const total = this.hitungTotal(updateParkirDto.jenisKendaraan, updateParkirDto.durasi);
      const updatedParkir = await this.prisma.parkir.update({
        where: { id },
        data: {
          platNomor: updateParkirDto.platNomor,
          jenisKendaraan: updateParkirDto.jenisKendaraan,
          durasi: updateParkirDto.durasi,
          total
        }
      });
      return {
        success: true,
        message: "Berhasil memperbarui data parkir",
        data: updatedParkir
      };
    } catch (error) {
      return {
        success: false,
        message: `error memperbarui data parkir: ${error.message}`,
        data: null
      };
    }
  }

  async remove(id: number) {
    try {
      const deletedParkir = await this.prisma.parkir.delete({ where: { id } });
      return {
        success: true,
        message: "Berhasil menghapus data parkir",
        data: deletedParkir
      };
    } catch (error) {
      return {
        success: false,
        message: `error menghapus data parkir: ${error.message}`,
        data: null
      };
    }
  }

  async getTotalPendapatan() {
    try {
      const result = await this.prisma.parkir.groupBy({
        by: ['jenisKendaraan'],
        _sum: {
          total: true,
        },
      });
      const roda2 = result.find(r => r.jenisKendaraan === 'roda2')?._sum.total || 0;
      const roda4 = result.find(r => r.jenisKendaraan === 'roda4')?._sum.total || 0;

      return {
        success: true,
        message: "Berhasil mengambil total pendapatan",
        data: {
          roda2,
          roda4,
          total: roda2 + roda4
        }
      }
    } catch (error) {
      return {
        success: false,
        message: `error mengambil total pendapatan: ${error.message}`,
        data: null
      }
    }
  }
}