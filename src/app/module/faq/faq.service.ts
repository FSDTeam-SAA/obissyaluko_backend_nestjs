import { HttpException, Injectable } from '@nestjs/common';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Faq, FaqDocument } from './entities/faq.entity';
import { Model } from 'mongoose';
import { IFilterParams } from 'src/app/helpers/pick';
import paginationHelper, { IOptions } from 'src/app/helpers/pagenation';
import buildWhereConditions from 'src/app/helpers/buildWhereConditions';

@Injectable()
export class FaqService {
  constructor(
    @InjectModel(Faq.name) private readonly faqModel: Model<FaqDocument>,
  ) {}

  async create(createFaqDto: CreateFaqDto) {
    const faq = await this.faqModel.findOne({ question: createFaqDto.question });
    if (faq) {
      throw new HttpException('FAQ already exists', 400);
    }
    const result = await this.faqModel.create(createFaqDto);
    return result;
  }

  async findAll(params: IFilterParams, options: IOptions) {
    const { limit, page, skip, sortBy, sortOrder } = paginationHelper(options);
    const whereConditions = buildWhereConditions(params, [
      'question',
      'answer',
      'category',
    ]);
    const total = await this.faqModel.countDocuments(whereConditions);
    const faqs = await this.faqModel
      .find(whereConditions)
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortOrder });
    return { meta: { page, limit, total }, data: faqs };
  }

  async findOne(id: string) {
    const faq = await this.faqModel.findById(id);
    if (!faq) {
      throw new HttpException('FAQ not found', 404);
    }
    return faq;
  }

  async update(id: string, updateFaqDto: UpdateFaqDto) {
    const faq = await this.faqModel.findById(id);
    if (!faq) {
      throw new HttpException('FAQ not found', 404);
    }
    const result = await this.faqModel.findByIdAndUpdate(id, updateFaqDto, {
      new: true,
    });
    return result;
  }

  async remove(id: string) {
    const faq = await this.faqModel.findById(id);
    if (!faq) {
      throw new HttpException('FAQ not found', 404);
    }
    const result = await this.faqModel.findByIdAndDelete(id);
    return result;
  }
}
