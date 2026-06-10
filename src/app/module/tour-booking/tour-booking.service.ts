import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTourBookingDto } from './dto/create-tour-booking.dto';
import { UpdateTourBookingDto } from './dto/update-tour-booking.dto';
import { InjectModel } from '@nestjs/mongoose';
import {
  TourBooking,
  TourBookingDocument,
} from './entities/tour-booking.entity';
import { Model } from 'mongoose';
import { User, UserDocument } from '../user/entities/user.entity';
import { IFilterParams } from 'src/app/helpers/pick';
import paginationHelper, { IOptions } from 'src/app/helpers/pagenation';
import buildWhereConditions from 'src/app/helpers/buildWhereConditions';
import Stripe from 'stripe';
import config from 'src/app/config';
import { Payment, PaymentDocument } from '../payment/entities/payment.entity';

@Injectable()
export class TourBookingService {
  private readonly stripe?: Stripe;

  constructor(
    @InjectModel(TourBooking.name)
    private readonly tourBookingModel: Model<TourBookingDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Payment.name)
    private readonly paymentModel: Model<PaymentDocument>,
  ) {
    if (config.stripe.secretKey) {
      this.stripe = new Stripe(config.stripe.secretKey);
    }
  }

  private getStripeClient() {
    if (!this.stripe) {
      throw new HttpException('Stripe is not configured', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return this.stripe;
  }

  async createTourBooking(
    userId: string,
    createTourBookingDto: CreateTourBookingDto,
  ) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    const result = await this.tourBookingModel.create({
      ...createTourBookingDto,
      userId: user._id,
    });
    return result;
  }

  async findGetAllTourBookings(params: IFilterParams, options: IOptions) {
    const { limit, page, skip, sortBy, sortOrder } = paginationHelper(options);

    const whereConditions = buildWhereConditions(params, [
      'fullName',
      'email',
      'phone',
    ]);

    const result = await this.tourBookingModel
      .find(whereConditions)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit);

    return result;
  }

  async findOneTourBooking(id: string) {
    const result = await this.tourBookingModel.findById(id);
    return result;
  }

  async updateTourBooking(
    id: string,
    updateTourBookingDto: UpdateTourBookingDto,
  ) {
    const result = await this.tourBookingModel.findByIdAndUpdate(
      id,
      updateTourBookingDto,
      { new: true },
    );
    return result;
  }

  async removeTourBooking(id: string) {
    const result = await this.tourBookingModel.findByIdAndDelete(id);
    return result;
  }


  async approveTourBooking(id: string) {
    const tourBooking = await this.tourBookingModel.findById(id);
    if (!tourBooking) {
      throw new HttpException('Tour booking not found', HttpStatus.NOT_FOUND);
    }

    const payment = await this.paymentModel.findOne({
      tourBookingId: tourBooking._id,
      status: 'completed',
    });

    if (!payment) {
      throw new HttpException(
        'Cannot approve: payment is not completed yet',
        HttpStatus.BAD_REQUEST,
      );
    }

    tourBooking.status = 'approved';
    await tourBooking.save();

    return tourBooking;
  }

  async rejectTourBooking(id: string) {
    const tourBooking = await this.tourBookingModel.findById(id);
    if (!tourBooking) {
      throw new HttpException('Tour booking not found', HttpStatus.NOT_FOUND);
    }

    const completedPayment = await this.paymentModel.findOne({
      tourBookingId: tourBooking._id,
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
      } catch (err: any) {
        throw new HttpException(
          `Refund failed: ${err.message}`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    } else {
      const pendingPayment = await this.paymentModel.findOne({
        tourBookingId: tourBooking._id,
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
        } catch (err: any) {
          throw new HttpException(
            `Payment cancellation failed: ${err.message}`,
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      }
    }

    tourBooking.status = 'rejected';
    await tourBooking.save();

    return tourBooking;
  }
}
