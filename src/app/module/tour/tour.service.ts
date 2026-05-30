import { HttpException, Injectable } from '@nestjs/common';
import { CreateTourDto } from './dto/create-tour.dto';
import { UpdateTourDto } from './dto/update-tour.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tour, TourDocument } from './entities/tour.entity';
import { fileUpload } from 'src/app/helpers/fileUploder';
import { IFilterParams } from 'src/app/helpers/pick';
import paginationHelper, { IOptions } from 'src/app/helpers/pagenation';
import buildWhereConditions from 'src/app/helpers/buildWhereConditions';

@Injectable()
export class TourService {
  constructor(
    @InjectModel(Tour.name) private readonly tourModel: Model<TourDocument>,
  ) {}

  async createTour(
    createTourDto: CreateTourDto,
    files?: Express.Multer.File[],
  ) {
    const tour = await this.tourModel.findOne({ title: createTourDto.title });
    if (tour) {
      throw new HttpException('Tour already exists', 400);
    }

    if (!files || files.length === 0) {
      throw new HttpException('Tour images are required', 400);
    }

    const uploadedUrls = await Promise.all(
      files.map(async (file) => {
        const uploaded = await fileUpload.uploadToCloudinary(file);
        return uploaded.url;
      }),
    );

    createTourDto.images = uploadedUrls;

    const result = await this.tourModel.create(createTourDto);
    return result;
  }

  async findAll(params: IFilterParams, options: IOptions) {
    const { limit, page, skip, sortBy, sortOrder } = paginationHelper(options);
    const whereConditions = buildWhereConditions(params, [
      'title',
      'destination',
      'description',
      'itinerary',
      'hotelInfo',
      'highlights',
    ]);

    const total = await this.tourModel.countDocuments(whereConditions);
    const tours = await this.tourModel
      .find(whereConditions)
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortOrder });

    return {
      meta: {
        page,
        limit,
        total,
      },
      data: tours,
    };
  }

  async findOne(id: string) {
    const tour = await this.tourModel.findById(id);
    if (!tour) {
      throw new HttpException('Tour not found', 404);
    }
    return tour;
  }

  async update(
    id: string,
    updateTourDto: UpdateTourDto,
    files?: Express.Multer.File[],
  ) {
    const tour = await this.tourModel.findById(id);
    if (!tour) {
      throw new HttpException('Tour not found', 404);
    }

    // Build update payload — only include defined fields
    const updatePayload: Partial<UpdateTourDto> = {};

    for (const key of Object.keys(updateTourDto) as (keyof UpdateTourDto)[]) {
      if (updateTourDto[key] !== undefined && key !== 'images') {
        (updatePayload as any)[key] = updateTourDto[key];
      }
    }

    // Only update images if new files are uploaded
    if (files && files.length > 0) {
      const uploadedUrls = await Promise.all(
        files.map(async (file) => {
          const uploaded = await fileUpload.uploadToCloudinary(file);
          return uploaded.url;
        }),
      );
      updatePayload.images = uploadedUrls;
      // ✅ If no new files → existing images in DB remain untouched
    }

    const updatedTour = await this.tourModel.findByIdAndUpdate(
      id,
      { $set: updatePayload }, // ✅ $set ensures only changed fields are updated
      { new: true },
    );

    return updatedTour;
  }

  async remove(id: string) {
    const tour = await this.tourModel.findById(id);
    if (!tour) {
      throw new HttpException('Tour not found', 404);
    }
    const result = await this.tourModel.findByIdAndDelete(id);
    return result;
  }
}
