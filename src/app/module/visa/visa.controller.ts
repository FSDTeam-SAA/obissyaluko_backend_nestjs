<<<<<<< HEAD
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  Req,
  Put,
} from '@nestjs/common';
import { VisaService } from './visa.service';
import { CreateVisaDto } from './dto/create-visa.dto';
import { UpdateVisaDto } from './dto/update-visa.dto';
import { ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import AuthGuard from 'src/app/middlewares/auth.guard';
import type { Request } from 'express';
import pick from 'src/app/helpers/pick';

@Controller('visa')
export class VisaController {
  constructor(private readonly visaService: VisaService) {}

  @Post()
  @ApiOperation({
    summary: 'create visa',
  })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('admin'))
  @HttpCode(HttpStatus.CREATED)
  async createVisa(@Body() createVisaDto: CreateVisaDto) {
    const result = await this.visaService.createVisa(createVisaDto);
    return {
      message: 'Visa created successfully',
      data: result,
    };
  }

  @Get()
  @ApiOperation({
    summary: 'get all visa',
  })
  @ApiQuery({
    name: 'searchTerm',
    required: false,
    type: String,
    description: 'Search term',
  })
  @ApiQuery({
    name: 'visaTitle',
    required: false,
    type: String,
    description: 'Visa title',
  })
  @ApiQuery({
    name: 'category',
    required: false,
    type: String,
    description: 'Visa category',
  })
  @ApiQuery({
    name: 'processingTime',
    required: false,
    type: String,
    description: 'Visa processing time',
  })
  @ApiQuery({
    name: 'price',
    required: false,
    type: String,
    description: 'Visa price',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Limit',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page',
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    type: String,
    description: 'Sort by',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    type: String,
    description: 'Sort order',
  })
  @HttpCode(HttpStatus.OK)
  async getAllVisa(@Req() req: Request) {
    const filters = pick(req.query, [
      'searchTerm',
      'visaTitle',
      'category',
      'processingTime',
      'price',
    ]);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
    const result = await this.visaService.getAllVisa(filters, options);
    return {
      message: 'Visa fetched successfully',
      meta: result.meta,
      data: result.data,
    };
  }

  @Get('all-country-visa')
  @ApiOperation({
    summary: 'get all country visa',
  })
  @ApiQuery({
    name: 'searchTerm',
    required: false,
    type: String,
    description: 'Search term',
  })
  @ApiQuery({
    name: 'countryName',
    required: false,
    type: String,
    description: 'Country name',
  })
  @ApiQuery({
    name: 'countryCode',
    required: false,
    type: String,
    description: 'Country code',
  })
  @ApiQuery({
    name: 'visaAvailable',
    required: false,
    type: Boolean,
    description: 'Visa available',
  })
  @ApiQuery({
    name: 'studyAvailable',
    required: false,
    type: Boolean,
    description: 'Study available',
  })
  @ApiQuery({
    name: 'popular',
    required: false,
    type: Boolean,
    description: 'Popular',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Limit',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page',
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    type: String,
    description: 'Sort by',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    type: String,
    description: 'Sort order',
  })
  @HttpCode(HttpStatus.OK)
  async getAllCountryVisa(@Req() req: Request) {
    const filters = pick(req.query, [
      'searchTerm',
      'countryName',
      'countryCode',
      'visaAvailable',
      'studyAvailable',
      'popular',
    ]);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
    const result = await this.visaService.getAllCountryVisas(filters, options);
    return {
      message: 'Country visa fetched successfully',
      meta: result.meta,
      data: result.data,
    };
  }

  @Get(':id')
  @ApiOperation({
    summary: 'get single visa',
  })
  @HttpCode(HttpStatus.OK)
  async getSingleVisa(@Param('id') id: string) {
    const result = await this.visaService.getSingleVisa(id);
    return {
      message: 'Visa fetched successfully',
      data: result,
    };
  }

  @Put(':id')
  @ApiOperation({
    summary: 'update visa',
  })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('admin'))
  @HttpCode(HttpStatus.OK)
  async updateVisa(
    @Param('id') id: string,
    @Body() updateVisaDto: UpdateVisaDto,
  ) {
    const result = await this.visaService.updateVisa(id, updateVisaDto);
    return {
      message: 'Visa updated successfully',
      data: result,
    };
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'delete visa',
  })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('admin'))
  @HttpCode(HttpStatus.OK)
  async deleteVisa(@Param('id') id: string) {
    const result = await this.visaService.deleteVisa(id);
    return {
      message: 'Visa deleted successfully',
      data: result,
    };
  }
}
=======
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  Req,
  Put,
} from '@nestjs/common';
import { VisaService } from './visa.service';
import { CreateVisaDto } from './dto/create-visa.dto';
import { UpdateVisaDto } from './dto/update-visa.dto';
import { ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import AuthGuard from 'src/app/middlewares/auth.guard';
import type { Request } from 'express';
import pick from 'src/app/helpers/pick';

@Controller('visa')
export class VisaController {
  constructor(private readonly visaService: VisaService) {}

  @Post()
  @ApiOperation({
    summary: 'create visa',
  })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('admin'))
  @HttpCode(HttpStatus.CREATED)
  async createVisa(@Body() createVisaDto: CreateVisaDto) {
    const result = await this.visaService.createVisa(createVisaDto);
    return {
      message: 'Visa created successfully',
      data: result,
    };
  }

  @Get()
  @ApiOperation({
    summary: 'get all visa',
  })
  @ApiQuery({
    name: 'searchTerm',
    required: false,
    type: String,
    description: 'Search term',
  })
  @ApiQuery({
    name: 'visaTitle',
    required: false,
    type: String,
    description: 'Visa title',
  })
  @ApiQuery({
    name: 'category',
    required: false,
    type: String,
    description: 'Visa category',
  })
  @ApiQuery({
    name: 'processingTime',
    required: false,
    type: String,
    description: 'Visa processing time',
  })
  @ApiQuery({
    name: 'price',
    required: false,
    type: String,
    description: 'Visa price',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Limit',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page',
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    type: String,
    description: 'Sort by',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    type: String,
    description: 'Sort order',
  })
  @HttpCode(HttpStatus.OK)
  async getAllVisa(@Req() req: Request) {
    const filters = pick(req.query, [
      'searchTerm',
      'visaTitle',
      'category',
      'processingTime',
      'price',
    ]);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
    const result = await this.visaService.getAllVisa(filters, options);
    return {
      message: 'Visa fetched successfully',
      meta: result.meta,
      data: result.data,
    };
  }

  @Get(':id')
  @ApiOperation({
    summary: 'get single visa',
  })
  @HttpCode(HttpStatus.OK)
  async getSingleVisa(@Param('id') id: string) {
    const result = await this.visaService.getSingleVisa(id);
    return {
      message: 'Visa fetched successfully',
      data: result,
    };
  }

  @Put(':id')
  @ApiOperation({
    summary: 'update visa',
  })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('admin'))
  @HttpCode(HttpStatus.OK)
  async updateVisa(
    @Param('id') id: string,
    @Body() updateVisaDto: UpdateVisaDto,
  ) {
    const result = await this.visaService.updateVisa(id, updateVisaDto);
    return {
      message: 'Visa updated successfully',
      data: result,
    };
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'delete visa',
  })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('admin'))
  @HttpCode(HttpStatus.OK)
  async deleteVisa(@Param('id') id: string) {
    const result = await this.visaService.deleteVisa(id);
    return {
      message: 'Visa deleted successfully',
      data: result,
    };
  }
}
>>>>>>> daca00e8f27707a1630862b2681a5c74acfa355a
