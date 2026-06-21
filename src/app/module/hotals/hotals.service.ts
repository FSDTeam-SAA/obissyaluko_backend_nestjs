import { HttpException, Injectable } from '@nestjs/common';
import { CreateHotalDto } from './dto/create-hotal.dto';
import { UpdateHotalDto } from './dto/update-hotal.dto';
import { fileUpload } from 'src/app/helpers/fileUploder';
import { InjectModel } from '@nestjs/mongoose';
import { Hotal, HotalDocument } from './entities/hotal.entity';
import { Model } from 'mongoose';
import { IFilterParams } from 'src/app/helpers/pick';
import paginationHelper, { IOptions } from 'src/app/helpers/pagenation';
import buildWhereConditions from 'src/app/helpers/buildWhereConditions';

@Injectable()
export class HotalsService {
  constructor(
    @InjectModel(Hotal.name) private readonly hotalModel: Model<HotalDocument>,
  ) {}

  async createHotels(
    createHotalDto: CreateHotalDto,
    files?: Express.Multer.File[],
  ) {
    const hotel = await this.hotalModel.findOne({
      hotalName: createHotalDto.hotalName,
    });
    if (hotel) {
      throw new HttpException('Hotel already exists', 400);
    }

    if (files && files.length > 0) {
      const uploadedUrls = await Promise.all(
        files.map(async (file) => {
          const uploaded = await fileUpload.uploadToCloudinary(file);
          return uploaded.url;
        }),
      );
      createHotalDto.images = uploadedUrls;
    }

    const result = await this.hotalModel.create(createHotalDto);
    return result;
  }

  async findAll(params: IFilterParams, options: IOptions) {
    const { limit, page, skip, sortBy, sortOrder } = paginationHelper(options);
    const whereConditions = buildWhereConditions(params, [
      'hotalName',
      'location',
      'country',
      'description',
    ]);

    const total = await this.hotalModel.countDocuments(whereConditions);
    const hotels = await this.hotalModel
      .find(whereConditions)
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortOrder });

    return {
      meta: { page, limit, total },
      data: hotels,
    };
  }

  async findOne(id: string) {
    const hotel = await this.hotalModel.findById(id);
    if (!hotel) {
      throw new HttpException('Hotel not found', 404);
    }
    return hotel;
  }

  async update(
    id: string,
    updateHotalDto: UpdateHotalDto,
    files?: Express.Multer.File[],
  ) {
    const hotel = await this.hotalModel.findById(id);
    if (!hotel) {
      throw new HttpException('Hotel not found', 404);
    }

    const updatePayload: Partial<UpdateHotalDto> = {};

    for (const key of Object.keys(updateHotalDto) as (keyof UpdateHotalDto)[]) {
      if (updateHotalDto[key] !== undefined && key !== 'images') {
        (updatePayload as any)[key] = updateHotalDto[key];
      }
    }

    if (files && files.length > 0) {
      const uploadedUrls = await Promise.all(
        files.map(async (file) => {
          const uploaded = await fileUpload.uploadToCloudinary(file);
          return uploaded.url;
        }),
      );
      updatePayload.images = uploadedUrls;
    }

    const updatedHotel = await this.hotalModel.findByIdAndUpdate(
      id,
      { $set: updatePayload },
      { new: true },
    );

    return updatedHotel;
  }

  async remove(id: string) {
    const hotel = await this.hotalModel.findById(id);
    if (!hotel) {
      throw new HttpException('Hotel not found', 404);
    }
    const result = await this.hotalModel.findByIdAndDelete(id);
    return result;
  }
}
