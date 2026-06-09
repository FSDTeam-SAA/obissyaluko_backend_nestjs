import { Module } from '@nestjs/common';
import { VisaApplyService } from './visa-apply.service';
import { VisaApplyController } from './visa-apply.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { VisaApply, VisaApplySchema } from './entities/visa-apply.entity';
import { User, UserSchema } from '../user/entities/user.entity';
import { Visa, VisaSchema } from '../visa/entities/visa.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: VisaApply.name, schema: VisaApplySchema },
      { name: User.name, schema: UserSchema },
      { name: Visa.name, schema: VisaSchema },
    ]),
  ],
  controllers: [VisaApplyController],
  providers: [VisaApplyService],
})
export class VisaApplyModule {}
