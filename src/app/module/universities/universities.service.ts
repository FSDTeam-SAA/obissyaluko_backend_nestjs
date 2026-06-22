import { HttpException, Injectable } from '@nestjs/common';
import { CreateUniversityDto } from './dto/create-university.dto';
import { UpdateUniversityDto } from './dto/update-university.dto';
import { InjectModel } from '@nestjs/mongoose';
import { University, UniversityDocument } from './entities/university.entity';
import { Model } from 'mongoose';
import { IFilterParams } from 'src/app/helpers/pick';
import paginationHelper, { IOptions } from 'src/app/helpers/pagenation';
import buildWhereConditions from 'src/app/helpers/buildWhereConditions';
import { fileUpload } from 'src/app/helpers/fileUploder';

@Injectable()
export class UniversitiesService {
  constructor(
    @InjectModel(University.name)
    private readonly universityModel: Model<UniversityDocument>,
  ) {}

  async createUniversity(
    createUniversityDto: CreateUniversityDto,
    files?: Express.Multer.File[],
  ) {
    const university = await this.universityModel.findOne({
      universityName: createUniversityDto.universityName,
    });
    if (university) {
      throw new HttpException('University already exists', 400);
    }
    if (!files || files.length === 0) {
      throw new HttpException('Image and Logo files are required', 400);
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

    const uploadedImage = uploadedFiles.find(
      (file) => file.fieldname === 'image',
    );
    const uploadedLogo = uploadedFiles.find(
      (file) => file.fieldname === 'logo',
    );

    if (!uploadedImage || !uploadedLogo) {
      throw new HttpException('Image and Logo files are required', 400);
    }

    createUniversityDto.image = uploadedImage.url;
    createUniversityDto.logo = uploadedLogo.url;
    const createdUniversity =
      await this.universityModel.create(createUniversityDto);
    return createdUniversity;
  }

  async getAllUniversities(params: IFilterParams, options: IOptions) {
    const { limit, page, skip, sortBy, sortOrder } = paginationHelper(options);
    const whereConditions = buildWhereConditions(params, [
      'universityName',
      'country',
      'description',
    ]);

    const total = await this.universityModel.countDocuments(whereConditions);
    const universities = await this.universityModel
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
      data: universities,
    };
  }

  async getSingleUniversity(id: string) {
    const university = await this.universityModel.findById(id);
    if (!university) {
      throw new HttpException('University not found', 404);
    }
    return university;
  }

  async updateUniversity(
    id: string,
    updateUniversityDto: UpdateUniversityDto,
    files?: Express.Multer.File[],
  ) {
    const university = await this.universityModel.findById(id);
    if (!university) {
      throw new HttpException('University not found', 404);
    }

    if (files) {
      const uploadedFiles = await Promise.all(
        files.map(async (file) => {
          const uploaded = await fileUpload.uploadToCloudinary(file);
          return {
            fieldname: file.fieldname,
            url: uploaded.url,
          };
        }),
      );

      const uploadedImage = uploadedFiles.find(
        (file) => file.fieldname === 'image',
      );
      const uploadedLogo = uploadedFiles.find(
        (file) => file.fieldname === 'logo',
      );

      if (!uploadedImage || !uploadedLogo) {
        throw new HttpException('Image and Logo files are required', 400);
      }

      updateUniversityDto.image = uploadedImage.url;
      updateUniversityDto.logo = uploadedLogo.url;
    }
    const updatedUniversity = await this.universityModel.findByIdAndUpdate(
      id,
      updateUniversityDto,
      { new: true },
    );
    return updatedUniversity;
  }

  async deleteUniversity(id: string) {
    const university = await this.universityModel.findById(id);
    if (!university) {
      throw new HttpException('University not found', 404);
    }
    const result = await this.universityModel.findByIdAndDelete(id);
    return result;
  }

  async getUniversityPrograms(params: IFilterParams, options: IOptions) {
    const { limit, page, skip, sortBy, sortOrder } = paginationHelper(options);
    const whereConditions = buildWhereConditions(params, [
      'programName',
      'degree',
      'fieldOfStudy',
    ]);

    const total = await this.universityModel.countDocuments(whereConditions);
    const universities = await this.universityModel
      .find(whereConditions)
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortOrder })
      .populate({
        path: 'programs',
        populate: {
          path: 'programName',
          model: 'Program',
        },
      })
      .populate('country', 'countryName');
    return {
      meta: {
        page,
        limit,
        total,
      },
      data: universities,
    };
  }
}
