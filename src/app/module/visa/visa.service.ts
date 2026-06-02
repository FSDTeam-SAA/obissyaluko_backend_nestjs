import { HttpException, Injectable } from '@nestjs/common';
import { CreateVisaDto } from './dto/create-visa.dto';
import { UpdateVisaDto } from './dto/update-visa.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Visa, VisaDocument } from './entities/visa.entity';
import { Model } from 'mongoose';
import { IFilterParams } from 'src/app/helpers/pick';
import paginationHelper, { IOptions } from 'src/app/helpers/pagenation';
import buildWhereConditions from 'src/app/helpers/buildWhereConditions';
import { Country, CountryDocument } from '../country/entities/country.entity';

@Injectable()
export class VisaService {
  constructor(
    @InjectModel(Visa.name) private readonly visaModel: Model<VisaDocument>,
    @InjectModel(Country.name)
    private readonly countryModel: Model<CountryDocument>,
  ) {}

  async createVisa(createVisaDto: CreateVisaDto) {
    const result = await this.visaModel.create(createVisaDto);
    return result;
  }

  async getAllVisa(params: IFilterParams, options: IOptions) {
    const { limit, page, skip, sortBy, sortOrder } = paginationHelper(options);
    const whereConditions = buildWhereConditions(params, [
      'visaTitle',
      'category',
      'processingTime',
      'price',
    ]);

    const total = await this.visaModel.countDocuments(whereConditions);
    const visas = await this.visaModel
      .find(whereConditions)
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortOrder })
      .populate('country', 'countryName');

    return {
      meta: {
        page,
        limit,
        total,
      },
      data: visas,
    };
  }

  async getSingleVisa(id: string) {
    const visa = await this.visaModel.findById(id);
    if (!visa) {
      throw new HttpException('Visa not found', 404);
    }
    return visa;
  }

  async updateVisa(id: string, updateVisaDto: UpdateVisaDto) {
    const visa = await this.visaModel.findById(id);
    if (!visa) {
      throw new HttpException('Visa not found', 404);
    }
    const updatedVisa = await this.visaModel.findByIdAndUpdate(
      id,
      updateVisaDto,
      { new: true },
    );
    return updatedVisa;
  }

  async deleteVisa(id: string) {
    const visa = await this.visaModel.findById(id);
    if (!visa) {
      throw new HttpException('Visa not found', 404);
    }
    const result = await this.visaModel.findByIdAndDelete(id);
    return result;
  }

  async getAllCountryVisas(params: IFilterParams, options: IOptions): Promise<any>  {
    const { limit, page, skip, sortBy, sortOrder } = paginationHelper(options);
    const whereConditions = buildWhereConditions(params, [
      'countryName',
      'countryCode',
      'visaAvailable',
      'studyAvailable',
      'popular',
    ]);

    const total = await this.countryModel.countDocuments(whereConditions);
    const countries = await this.countryModel
      .find(whereConditions)
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortOrder });

    const countriesWithVisas = await Promise.all(
      countries.map(async (country) => {
        const visas = await this.visaModel
          .find({ country: country._id as any })
          .select('visaTitle category processingTime price');
        return { ...country, visas };
      }),
    );

    return {
      meta: { page, limit, total },
      data: countriesWithVisas,
    };
  }
}
