import { HttpException, Injectable } from '@nestjs/common';
import { CreateVisaApplyDto } from './dto/create-visa-apply.dto';
import { UpdateVisaApplyDto } from './dto/update-visa-apply.dto';
import { InjectModel } from '@nestjs/mongoose';
import { VisaApply, VisaApplyDocument } from './entities/visa-apply.entity';
import { Model } from 'mongoose';
import { User, UserDocument } from '../user/entities/user.entity';
import { Visa, VisaDocument } from '../visa/entities/visa.entity';
import { IFilterParams } from 'src/app/helpers/pick';
import buildWhereConditions from 'src/app/helpers/buildWhereConditions';
import paginationHelper, { IOptions } from 'src/app/helpers/pagenation';
import { fileUpload } from 'src/app/helpers/fileUploder';

@Injectable()
export class VisaApplyService {
  constructor(
    @InjectModel(VisaApply.name)
    private readonly visaApplyModel: Model<VisaApplyDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Visa.name) private readonly visaModel: Model<VisaDocument>,
  ) {}

  async applyForVisa(
    userId: string,
    createVisaApplyDto: CreateVisaApplyDto,
    files: Express.Multer.File[],
  ) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new HttpException('User not found', 404);
    }

    const visa = await this.visaModel.findById(createVisaApplyDto.visaId);
    if (!visa) {
      throw new HttpException('Visa not found', 404);
    }

    if (files && files.length > 0) {
      await Promise.all(
        files.map(async (file) => {
          const { url } = await fileUpload.uploadToCloudinary(file);

          if (file.fieldname === 'photo') {
            createVisaApplyDto.photo = url;
          } else if (file.fieldname === 'nidCopy') {
            createVisaApplyDto.nidCopy = url;
          } else if (file.fieldname === 'passportCopy') {
            createVisaApplyDto.passportCopy = url;
          } else if (file.fieldname === 'bankStatement') {
            createVisaApplyDto.bankStatement = url;
          }
        }),
      );
    }

    const result = await this.visaApplyModel.create({
      ...createVisaApplyDto,
      userId,
    });

    return result;
  }

  async getAllVisaApplication(params: IFilterParams, options: IOptions) {
    const { limit, page, skip, sortBy, sortOrder } = paginationHelper(options);
    const whereConditions = buildWhereConditions(params, [
      'visaTitle',
      'category',
      'processingTime',
      'price',
    ]);

    const total = await this.visaApplyModel.countDocuments(whereConditions);
    const visas = await this.visaApplyModel
      .find(whereConditions)
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortOrder })
      .populate({
        path: 'user',
        select: 'name email',
      })
      .populate({
        path: 'visa',
        select: 'visaTitle',
      });

    return {
      meta: {
        page,
        limit,
        total,
      },
      data: visas,
    };
  }

  async findOne(id: string) {
    const visaApplication = await this.visaApplyModel
      .findById(id)
      .populate({
        path: 'user',
        select: 'name email',
      })
      .populate({
        path: 'visa',
        select: 'visaTitle',
      });
    if (!visaApplication) {
      throw new HttpException('Visa application not found', 404);
    }
    return visaApplication;
  }

  async update(
    id: string,
    updateVisaApplyDto: UpdateVisaApplyDto,
    files: Express.Multer.File[],
  ) {
    const visaApplication = await this.visaApplyModel.findById(id);
    if (!visaApplication) {
      throw new HttpException('Visa application not found', 404);
    }
    if (files && files.length > 0) {
      await Promise.all(
        files.map(async (file) => {
          const { url } = await fileUpload.uploadToCloudinary(file);

          if (file.fieldname === 'photo') {
            updateVisaApplyDto.photo = url;
          } else if (file.fieldname === 'nidCopy') {
            updateVisaApplyDto.nidCopy = url;
          } else if (file.fieldname === 'passportCopy') {
            updateVisaApplyDto.passportCopy = url;
          } else if (file.fieldname === 'bankStatement') {
            updateVisaApplyDto.bankStatement = url;
          }
        }),
      );
    }
    const result = await this.visaApplyModel.findByIdAndUpdate(
      id,
      updateVisaApplyDto,
      { new: true },
    );
    return result;
  }

  async remove(id: string) {
    const visaApplication = await this.visaApplyModel.findById(id);
    if (!visaApplication) {
      throw new HttpException('Visa application not found', 404);
    }
    const result = await this.visaApplyModel.findByIdAndDelete(id);
    return result;
  }
}
