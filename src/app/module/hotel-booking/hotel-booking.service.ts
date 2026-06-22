import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateHotelBookingDto } from './dto/create-hotel-booking.dto';
import { UpdateHotelBookingDto } from './dto/update-hotel-booking.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../user/entities/user.entity';
import { Hotal, HotalDocument } from '../hotals/entities/hotal.entity';
import {
  HotelBooking,
  HotelBookingDocument,
} from './entities/hotel-booking.entity';
import { IFilterParams } from 'src/app/helpers/pick';
import paginationHelper, { IOptions } from 'src/app/helpers/pagenation';
import buildWhereConditions from 'src/app/helpers/buildWhereConditions';
import Stripe from 'stripe';
import config from 'src/app/config';
import { Payment, PaymentDocument } from '../payment/entities/payment.entity';
import { PaymentStatus } from '../consultation/entities/consultation.entity';

@Injectable()
export class HotelBookingService {
  private readonly stripe?: Stripe;

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Hotal.name) private readonly hotelModel: Model<HotalDocument>,
    @InjectModel(HotelBooking.name)
    private readonly hotelBookingModel: Model<HotelBookingDocument>,
    @InjectModel(Payment.name)
    private readonly paymentModel: Model<PaymentDocument>,
  ) {
    if (config.stripe.secretKey) {
      this.stripe = new Stripe(config.stripe.secretKey);
    }
  }

  private getStripeClient() {
    if (!this.stripe) {
      throw new HttpException(
        'Stripe is not configured',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return this.stripe;
  }

  async createHotelBooking(
    userId: string,
    hotelId: string,
    createHotelBookingDto: CreateHotelBookingDto,
  ) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    const hotel = await this.hotelModel.findById(hotelId);
    if (!hotel)
      throw new HttpException('Hotel not found', HttpStatus.NOT_FOUND);

    const result = await this.hotelBookingModel.create({
      ...createHotelBookingDto,
      userId,
      hotelId,
    });
    return result;
  }

  async getAllHotelBooking(params: IFilterParams, options: IOptions) {
    const { limit, page, skip, sortBy, sortOrder } = paginationHelper(options);
    const whereConditions = buildWhereConditions(params, [
      'fullName',
      'email',
      'phone',
      'status',
    ]);
    const total = await this.hotelBookingModel.countDocuments(whereConditions);
    const hotels = await this.hotelBookingModel
      .find(whereConditions)
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortOrder });
    return { meta: { page, limit, total }, data: hotels };
  }

  async getMyAllHotelBooking(
    userId: string,
    params: IFilterParams,
    options: IOptions,
  ) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    const { limit, page, skip, sortBy, sortOrder } = paginationHelper(options);
    const whereConditions = {
      ...buildWhereConditions(params, [
        'fullName',
        'email',
        'phone',
        'status',
      ]),
      userId: userId,
    };

    const total = await this.hotelBookingModel.countDocuments(whereConditions);
    const hotels = await this.hotelBookingModel
      .find(whereConditions)
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortOrder });
    return { meta: { page, limit, total }, data: hotels };
  }

  async findOneHotelBooking(id: string) {
    const result = await this.hotelBookingModel.findById(id);
    if (!result)
      throw new HttpException('Hotel booking not found', HttpStatus.NOT_FOUND);
    return result;
  }

  async updateHotelBooking(
    id: string,
    updateHotelBookingDto: UpdateHotelBookingDto,
  ) {
    const result = await this.hotelBookingModel.findByIdAndUpdate(
      id,
      updateHotelBookingDto,
      { new: true },
    );
    if (!result)
      throw new HttpException('Hotel booking not found', HttpStatus.NOT_FOUND);
    return result;
  }

  async removeHotelBooking(id: string) {
    const result = await this.hotelBookingModel.findByIdAndDelete(id);
    if (!result)
      throw new HttpException('Hotel booking not found', HttpStatus.NOT_FOUND);
    return result;
  }

  async approveHotelBooking(id: string) {
    const hotelBooking = await this.hotelBookingModel.findById(id);
    if (!hotelBooking) {
      throw new HttpException('Hotel booking not found', HttpStatus.NOT_FOUND);
    }

    if (hotelBooking.totalAmount > 0) {
      if (hotelBooking.paymentStatus !== PaymentStatus.AUTHORIZED) {
        throw new HttpException(
          'Cannot approve: payment has not been authorized yet',
          HttpStatus.CONFLICT,
        );
      }

      const payment = await this.paymentModel.findOne({
        hotelBookingId: hotelBooking._id,
        status: 'authorized',
      });

      if (!payment?.stripePaymentIntentId) {
        throw new HttpException(
          'Cannot approve: authorized payment record not found',
          HttpStatus.CONFLICT,
        );
      }

      try {
        const stripe = this.getStripeClient();
        const intent = await stripe.paymentIntents.capture(
          payment.stripePaymentIntentId,
        );
        if (intent.status !== 'succeeded') {
          throw new Error(`Stripe capture status is ${intent.status}`);
        }
        payment.status = 'completed';
        await payment.save();
        hotelBooking.paymentStatus = PaymentStatus.PAID;
      } catch (err: any) {
        throw new HttpException(
          `Payment capture failed: ${err.message}`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }

    hotelBooking.adminStatus = 'approved';
    await hotelBooking.save();

    return hotelBooking;
  }

  async rejectHotelBooking(id: string) {
    const hotelBooking = await this.hotelBookingModel.findById(id);
    if (!hotelBooking) {
      throw new HttpException('Hotel booking not found', HttpStatus.NOT_FOUND);
    }

    const completedPayment = await this.paymentModel.findOne({
      hotelBookingId: hotelBooking._id,
      status: 'completed',
    });

    if (completedPayment?.stripePaymentIntentId) {
      try {
        const stripe = this.getStripeClient();
        await stripe.refunds.create({
          payment_intent: completedPayment.stripePaymentIntentId,
        });
        completedPayment.status = 'refunded';
        await completedPayment.save();
        hotelBooking.paymentStatus = PaymentStatus.REFUNDED;
      } catch (err: any) {
        throw new HttpException(
          `Refund failed: ${err.message}`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    } else {
      const pendingPayment = await this.paymentModel.findOne({
        hotelBookingId: hotelBooking._id,
        status: { $in: ['pending', 'authorized'] },
      });

      if (pendingPayment?.stripePaymentIntentId) {
        try {
          const stripe = this.getStripeClient();
          await stripe.paymentIntents.cancel(
            pendingPayment.stripePaymentIntentId,
          );
          pendingPayment.status = 'cancelled';
          await pendingPayment.save();
          hotelBooking.paymentStatus = PaymentStatus.CANCELLED;
        } catch (err: any) {
          throw new HttpException(
            `Payment cancellation failed: ${err.message}`,
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      }
    }

    hotelBooking.adminStatus = 'rejected';
    await hotelBooking.save();

    return hotelBooking;
  }
}
