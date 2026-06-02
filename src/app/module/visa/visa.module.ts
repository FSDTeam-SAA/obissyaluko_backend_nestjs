import { Module } from '@nestjs/common';
import { VisaService } from './visa.service';
import { VisaController } from './visa.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Visa, VisaSchema } from './entities/visa.entity';
import { Country, CountrySchema } from '../country/entities/country.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Visa.name, schema: VisaSchema },
      { name: Country.name, schema: CountrySchema },
    ]),
  ],
  controllers: [VisaController],
  providers: [VisaService],
})
export class VisaModule {}
