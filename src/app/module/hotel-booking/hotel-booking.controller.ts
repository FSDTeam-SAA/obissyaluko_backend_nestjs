import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { HotelBookingService } from './hotel-booking.service';
import { UpdateHotelBookingDto } from './dto/update-hotel-booking.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import type { Request } from 'express';
import AuthGuard from 'src/app/middlewares/auth.guard';
import pick from 'src/app/helpers/pick';
import { CreateHotelBookingDto } from './dto/create-hotel-booking.dto';

@ApiTags('Hotel Booking')
@Controller('hotel-booking')
export class HotelBookingController {
  constructor(private readonly hotelBookingService: HotelBookingService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new hotel booking' })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('user', 'admin'))
  @HttpCode(HttpStatus.CREATED)
  async createHotelBooking(
    @Req() req: Request,
    @Body() createHotelBookingDto: CreateHotelBookingDto,
  ) {
    const userId = req.user!.id;
    const result = await this.hotelBookingService.createHotelBooking(
      userId,
      createHotelBookingDto.hotelId,
      createHotelBookingDto,
    );
    return {
      message: 'Hotel booking created successfully',
      data: result,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all hotel bookings (Admin)' })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('admin'))
  @ApiQuery({ name: 'searchTerm', required: false, type: String })
  @ApiQuery({ name: 'fullName', required: false, type: String })
  @ApiQuery({ name: 'email', required: false, type: String })
  @ApiQuery({ name: 'phone', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'sortBy', required: false, type: String })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    enum: ['asc', 'desc'],
    example: 'desc',
  })
  @HttpCode(HttpStatus.OK)
  async getAllHotelBookings(@Req() req: Request) {
    const filters = pick(req.query, [
      'searchTerm',
      'fullName',
      'email',
      'phone',
      'status',
    ]);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
    const result = await this.hotelBookingService.getAllHotelBooking(
      filters,
      options,
    );
    return {
      message: 'Hotel bookings retrieved successfully',
      meta: result.meta,
      data: result.data,
    };
  }

  @Get('my')
  @ApiOperation({ summary: 'Get my hotel bookings' })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('user', 'admin'))
  @ApiQuery({ name: 'searchTerm', required: false, type: String })
  @ApiQuery({ name: 'fullName', required: false, type: String })
  @ApiQuery({ name: 'email', required: false, type: String })
  @ApiQuery({ name: 'phone', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'sortBy', required: false, type: String })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    enum: ['asc', 'desc'],
    example: 'desc',
  })
  @HttpCode(HttpStatus.OK)
  async getMyHotelBookings(@Req() req: Request) {
    const userId = req.user!.id;
    const filters = pick(req.query, [
      'searchTerm',
      'fullName',
      'email',
      'phone',
      'status',
    ]);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
    const result = await this.hotelBookingService.getMyAllHotelBooking(
      userId,
      filters,
      options,
    );
    return {
      message: 'Hotel bookings retrieved successfully',
      meta: result.meta,
      data: result.data,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a hotel booking by ID' })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('user', 'admin'))
  @HttpCode(HttpStatus.OK)
  async getOneHotelBooking(@Param('id') id: string) {
    const result = await this.hotelBookingService.findOneHotelBooking(id);
    return {
      message: 'Hotel booking retrieved successfully',
      data: result,
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a hotel booking' })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('admin'))
  @HttpCode(HttpStatus.OK)
  async updateHotelBooking(
    @Param('id') id: string,
    @Body() updateHotelBookingDto: UpdateHotelBookingDto,
  ) {
    const result = await this.hotelBookingService.updateHotelBooking(
      id,
      updateHotelBookingDto,
    );
    return {
      message: 'Hotel booking updated successfully',
      data: result,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a hotel booking' })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('admin'))
  @HttpCode(HttpStatus.OK)
  async deleteHotelBooking(@Param('id') id: string) {
    const result = await this.hotelBookingService.removeHotelBooking(id);
    return {
      message: 'Hotel booking deleted successfully',
      data: result,
    };
  }

  @Patch(':id/approve')
  @ApiOperation({ summary: 'Admin approves a hotel booking' })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('admin'))
  @HttpCode(HttpStatus.OK)
  async approveHotelBooking(@Param('id') id: string) {
    const result = await this.hotelBookingService.approveHotelBooking(id);
    return {
      message: 'Hotel booking approved successfully',
      data: result,
    };
  }

  @Patch(':id/reject')
  @ApiOperation({ summary: 'Admin rejects a hotel booking' })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('admin'))
  @HttpCode(HttpStatus.OK)
  async rejectHotelBooking(@Param('id') id: string) {
    const result = await this.hotelBookingService.rejectHotelBooking(id);
    return {
      message: 'Hotel booking rejected successfully',
      data: result,
    };
  }
}
