import { HttpException, Injectable } from '@nestjs/common';
import { CreateProgramDto } from './dto/create-program.dto';
import { UpdateProgramDto } from './dto/update-program.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Program, ProgramDocument } from './entities/program.entity';
import { Model } from 'mongoose';
import { IFilterParams } from 'src/app/helpers/pick';
import paginationHelper, { IOptions } from 'src/app/helpers/pagenation';
import buildWhereConditions from 'src/app/helpers/buildWhereConditions';

@Injectable()
export class ProgramsService {
  constructor(
    @InjectModel(Program.name) private programModel: Model<ProgramDocument>,
  ) {}

  async createProgram(createProgramDto: CreateProgramDto) {
    const result = await this.programModel.create(createProgramDto);
    return result;
  }

  async getAllPrograms(params: IFilterParams, options: IOptions) {
    const { limit, page, skip, sortBy, sortOrder } = paginationHelper(options);
    const whereConditions = buildWhereConditions(params, [
      'programName',
      'degreeLevel',
      'duration',
      'eligibility',
      'requirements',
    ]);

    const total = await this.programModel.countDocuments(whereConditions);
    const programs = await this.programModel
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
      data: programs,
    };
  }

  async getSingleProgram(id: string) {
    const program = await this.programModel.findById(id);
    if (!program) {
      throw new HttpException('Program not found', 404);
    }
    return program;
  }

  async updateProgram(id: string, updateProgramDto: UpdateProgramDto) {
    const program = await this.programModel.findById(id);
    if (!program) {
      throw new HttpException('Program not found', 404);
    }
    const updatedProgram = await this.programModel.findByIdAndUpdate(
      id,
      updateProgramDto,
      { new: true },
    );
    return updatedProgram;
  }

  async deleteProgram(id: string) {
    const program = await this.programModel.findById(id);
    if (!program) {
      throw new HttpException('Program not found', 404);
    }
    const result = await this.programModel.findByIdAndDelete(id);
    return result;
  }
}
