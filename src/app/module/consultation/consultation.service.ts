// consultation.service.ts
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Consultation,
  ConsultationDocument,
} from './entities/consultation.entity';
import { CreateConsultationDto } from './dto/create-consultation.dto';
import { UpdateConsultationDto } from './dto/update-consultation.dto';

@Injectable()
export class ConsultationService {
  constructor(
    @InjectModel(Consultation.name)
    private readonly consultationModel: Model<ConsultationDocument>,
  ) {}

  // User: book consultation
  async create(dto: CreateConsultationDto, userId?: string) {
    const data: any = { ...dto };
    if (userId) data.userId = userId;

    const result = await this.consultationModel.create(data);
    return result;
  }

  // Admin: get all with optional filters
  async findAll(query: any = {}) {
    const filter: any = {};

    if (query.status) filter.status = query.status;
    if (query.paymentStatus) filter.paymentStatus = query.paymentStatus;
    if (query.type) filter.type = query.type;

    const consultations = await this.consultationModel
      .find(filter)
      .sort({ createdAt: -1 });

    return consultations;
  }

  // User: get own consultations
  async findByUser(userId: string) {
    return this.consultationModel.find({ userId }).sort({ createdAt: -1 });
  }

  // Get single
  async findOne(id: string) {
    const consultation = await this.consultationModel.findById(id);
    if (!consultation) {
      throw new HttpException('Consultation not found', HttpStatus.NOT_FOUND);
    }
    return consultation;
  }

  // Admin: update (status, meetingLink, notes, paymentStatus)
  async update(id: string, dto: UpdateConsultationDto) {
    const consultation = await this.consultationModel.findById(id);
    if (!consultation) {
      throw new HttpException('Consultation not found', HttpStatus.NOT_FOUND);
    }

    // Only update defined fields
    const updatePayload: Partial<UpdateConsultationDto> = {};
    for (const key of Object.keys(dto) as (keyof UpdateConsultationDto)[]) {
      if (dto[key] !== undefined) {
        (updatePayload as any)[key] = dto[key];
      }
    }

    const updated = await this.consultationModel.findByIdAndUpdate(
      id,
      { $set: updatePayload },
      { new: true },
    );
    return updated;
  }

  // Admin: delete
  async remove(id: string) {
    const consultation = await this.consultationModel.findById(id);
    if (!consultation) {
      throw new HttpException('Consultation not found', HttpStatus.NOT_FOUND);
    }
    return this.consultationModel.findByIdAndDelete(id);
  }
}
