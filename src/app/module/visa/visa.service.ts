import { Injectable } from '@nestjs/common';
import { CreateVisaDto } from './dto/create-visa.dto';
import { UpdateVisaDto } from './dto/update-visa.dto';

@Injectable()
export class VisaService {
  create(createVisaDto: CreateVisaDto) {
    return 'This action adds a new visa';
  }

  findAll() {
    return `This action returns all visa`;
  }

  findOne(id: number) {
    return `This action returns a #${id} visa`;
  }

  update(id: number, updateVisaDto: UpdateVisaDto) {
    return `This action updates a #${id} visa`;
  }

  remove(id: number) {
    return `This action removes a #${id} visa`;
  }
}
