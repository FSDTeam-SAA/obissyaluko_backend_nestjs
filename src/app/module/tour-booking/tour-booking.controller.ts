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
import { TourBookingService } from './tour-booking.service';
import { CreateTourBookingDto } from './dto/create-tour-booking.dto';
import { UpdateTourBookingDto } from './dto/update-tour-booking.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import type { Request } from 'express';
import AuthGuard from 'src/app/middlewares/auth.guard';
import pick from 'src/app/helpers/pick';

@ApiTags('Tour Booking')
@Controller('tour-booking')
export class TourBookingController {
  constructor(private readonly tourBookingService: TourBookingService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new tour booking' })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('user', 'admin'))
  @HttpCode(HttpStatus.CREATED)
  async createTourBooking(
    @Req() req: Request,
    @Body() createTourBookingDto: CreateTourBookingDto,
  ) {
    const userId = req.user!.id;
    const result = await this.tourBookingService.createTourBooking(
      userId,
      createTourBookingDto,
    );
    return {
      message: 'Tour booking created successfully',
      data: result,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all tour bookings' })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('admin'))
  @ApiQuery({ name: 'searchTerm', required: false, type: String, example: '' })
  @ApiQuery({ name: 'fullName', required: false, type: String })
  @ApiQuery({ name: 'email', required: false, type: String })
  @ApiQuery({ name: 'phone', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    enum: ['asc', 'desc'],
    example: 'desc',
  })
  @HttpCode(HttpStatus.OK)
  async getAllTourBookings(@Req() req: Request) {
    const filters = pick(req.query, [
      'searchTerm',
      'fullName',
      'email',
      'phone',
    ]);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
    const result = await this.tourBookingService.findGetAllTourBookings(
      filters,
      options,
    );
    return {
      message: 'Tour bookings retrieved successfully',
      data: result,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a tour booking by ID' })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('user', 'admin'))
  @HttpCode(HttpStatus.OK)
  async getOneTourBooking(@Param('id') id: string) {
    const result = await this.tourBookingService.findOneTourBooking(id);
    return {
      message: 'Tour booking retrieved successfully',
      data: result,
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a tour booking' })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('admin'))
  @HttpCode(HttpStatus.OK)
  async updateTourBooking(
    @Param('id') id: string,
    @Body() updateTourBookingDto: UpdateTourBookingDto,
  ) {
    const result = await this.tourBookingService.updateTourBooking(
      id,
      updateTourBookingDto,
    );
    return {
      message: 'Tour booking updated successfully',
      data: result,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a tour booking' })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('admin'))
  @HttpCode(HttpStatus.OK)
  async deleteTourBooking(@Param('id') id: string) {
    const result = await this.tourBookingService.removeTourBooking(id);
    return {
      message: 'Tour booking deleted successfully',
      data: result,
    };
  }

  @Patch(':id/approve')
  @ApiOperation({ summary: 'Admin approves a tour booking' })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('admin'))
  @HttpCode(HttpStatus.OK)
  async approveTourBooking(@Param('id') id: string) {
    const result = await this.tourBookingService.approveTourBooking(id);
    return {
      message: 'Tour booking approved successfully',
      data: result,
    };
  }

  @Patch(':id/reject')
  @ApiOperation({ summary: 'Admin rejects a tour booking' })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('admin'))
  @HttpCode(HttpStatus.OK)
  async rejectTourBooking(@Param('id') id: string) {
    const result = await this.tourBookingService.rejectTourBooking(id);
    return {
      message: 'Tour booking rejected successfully',
      data: result,
    };
  }
}
