import { Module } from '@nestjs/common';
import { UniversitiesService } from './universities.service';
import { UniversitiesController } from './universities.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { University, UniversitySchema } from './entities/university.entity';
import { Program, ProgramSchema } from '../programs/entities/program.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: University.name, schema: UniversitySchema },
      {name: Program.name, schema: ProgramSchema}
    ]),
  ],
  controllers: [UniversitiesController],
  providers: [UniversitiesService],
})
export class UniversitiesModule {}
