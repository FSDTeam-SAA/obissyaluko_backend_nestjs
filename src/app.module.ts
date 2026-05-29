import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import config from './app/config';
import { ContactModule } from './app/module/contact/contact.module';
import { AuthModule } from './app/module/auth/auth.module';
import { UserModule } from './app/module/user/user.module';
import { DashboardModule } from './app/module/dashboard/dashboard.module';
import { SubscribeModule } from './app/module/subscribe/subscribe.module';
import { PaymentModule } from './app/module/payment/payment.module';
import { WebhookModule } from './app/module/webhook/webhook.module';
import { VisaModule } from './app/module/visa/visa.module';
import { CountryModule } from './app/module/country/country.module';
import { UniversitiesModule } from './app/module/universities/universities.module';
import { ProgramsModule } from './app/module/programs/programs.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(config.mongoUri),
    UserModule,
    AuthModule,
    ContactModule,
    DashboardModule,
    SubscribeModule,
    PaymentModule,
    WebhookModule,
    VisaModule,
    CountryModule,
    UniversitiesModule,
    ProgramsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
