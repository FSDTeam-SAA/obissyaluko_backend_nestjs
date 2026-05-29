import { HttpException, Injectable } from '@nestjs/common';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Country, CountryDocument } from './entities/country.entity';
import { Model } from 'mongoose';
import { fileUpload } from 'src/app/helpers/fileUploder';
import { IFilterParams } from 'src/app/helpers/pick';
import paginationHelper, { IOptions } from 'src/app/helpers/pagenation';
import buildWhereConditions from 'src/app/helpers/buildWhereConditions';

@Injectable()
export class CountryService {
  constructor(
    @InjectModel(Country.name)
    private readonly countryModel: Model<CountryDocument>,
  ) {}

  async createCountry(
    createCountryDto: CreateCountryDto,
    files?: Express.Multer.File[],
  ) {
    const country = await this.countryModel.findOne({
      countryName: createCountryDto.countryName,
    });
    if (country) {
      throw new HttpException('Country already exists', 400);
    }
    if (!files || files.length === 0) {
      throw new HttpException(
        'countryImage and countryFlag files are required',
        400,
      );
    }

    const uploadedFiles = await Promise.all(
      files.map(async (file) => {
        const uploaded = await fileUpload.uploadToCloudinary(file);
        return {
          fieldname: file.fieldname,
          url: uploaded.url,
        };
      }),
    );

    const countryImageFile = uploadedFiles.find(
      (f) => f.fieldname === 'countryImage',
    );
    const countryFlagFile = uploadedFiles.find(
      (f) => f.fieldname === 'countryFlag',
    );

    if (!countryImageFile || !countryFlagFile) {
      throw new HttpException(
        'Both countryImage and countryFlag files are required',
        400,
      );
    }

    createCountryDto.countryImage = countryImageFile.url;
    createCountryDto.countryFlag = countryFlagFile.url;
    const createdCountry = await this.countryModel.create(createCountryDto);
    return createdCountry;
  }

  async getAllCountry(params: IFilterParams, options: IOptions) {
    const { limit, page, skip, sortBy, sortOrder } = paginationHelper(options);
    const whereConditions = buildWhereConditions(params, [
      'countryName',
      'countryCode',
    ]);

    const total = await this.countryModel.countDocuments(whereConditions);
    const countries = await this.countryModel
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
      data: countries,
    };
  }

  async getSingleCountry(id: string) {
    const country = await this.countryModel.findById(id);
    if (!country) {
      throw new HttpException('Country not found', 404);
    }
    return country;
  }

  async updateCountry(
    id: string,
    updateCountryDto: UpdateCountryDto,
    files?: Express.Multer.File[],
  ) {
    const country = await this.countryModel.findById(id);
    if (!country) {
      throw new HttpException('Country not found', 404);
    }
    if (files && files.length > 0) {
      const uploadedFiles = await Promise.all(
        files.map(async (file) => {
          const uploaded = await fileUpload.uploadToCloudinary(file);
          return {
            fieldname: file.fieldname,
            url: uploaded.url,
          };
        }),
      );

      const countryImageFile = uploadedFiles.find(
        (f) => f.fieldname === 'countryImage',
      );
      const countryFlagFile = uploadedFiles.find(
        (f) => f.fieldname === 'countryFlag',
      );

      if (countryImageFile) {
        updateCountryDto.countryImage = countryImageFile.url;
      }
      if (countryFlagFile) {
        updateCountryDto.countryFlag = countryFlagFile.url;
      }
    }
    const updatedCountry = await this.countryModel.findByIdAndUpdate(
      id,
      updateCountryDto,
      { new: true },
    );
    return updatedCountry;
  }

  async deleteCountry(id: string) {
    const country = await this.countryModel.findById(id);
    if (!country) {
      throw new HttpException('Country not found', 404);
    }
    const result = await this.countryModel.findByIdAndDelete(id);
    return result;
  }
}
