import { Module } from '@nestjs/common';
import { HotalsService } from './hotals.service';
import { HotalsController } from './hotals.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Hotal, HotalSchema } from './entities/hotal.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Hotal.name, schema: HotalSchema }]),
  ],
  controllers: [HotalsController],
  providers: [HotalsService],
})
export class HotalsModule {}
