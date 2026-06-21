import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  UseGuards,
  HttpCode,
  HttpStatus,
  UploadedFiles,
  Req,
  Put,
} from '@nestjs/common';
import { HotalsService } from './hotals.service';
import { CreateHotalDto } from './dto/create-hotal.dto';
import { UpdateHotalDto } from './dto/update-hotal.dto';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import {
  AnyFilesInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import { fileUpload } from 'src/app/helpers/fileUploder';
import AuthGuard from 'src/app/middlewares/auth.guard';
import type { Request } from 'express';
import pick from 'src/app/helpers/pick';

@ApiTags('Hotels')
@Controller('hotals')
export class HotalsController {
  constructor(private readonly hotalsService: HotalsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new hotel' })
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('admin'))
  @UseInterceptors(FilesInterceptor('images', 5, fileUpload.uploadConfig))
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createHotalDto: CreateHotalDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const result = await this.hotalsService.createHotels(createHotalDto, files);
    return {
      message: 'Hotel created successfully',
      data: result,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all hotels' })
  @ApiQuery({ name: 'searchTerm', required: false, type: String })
  @ApiQuery({ name: 'hotalName', required: false, type: String })
  @ApiQuery({ name: 'location', required: false, type: String })
  @ApiQuery({ name: 'country', required: false, type: String })
  @ApiQuery({ name: 'description', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'sortBy', required: false, type: String })
  @ApiQuery({ name: 'sortOrder', required: false, type: String })
  @HttpCode(HttpStatus.OK)
  async findAll(@Req() req: Request) {
    const filters = pick(req.query, [
      'searchTerm',
      'hotalName',
      'location',
      'country',
      'description',
    ]);
    const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);
    const result = await this.hotalsService.findAll(filters, options);
    return {
      message: 'Hotels fetched successfully',
      meta: result.meta,
      data: result.data,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get hotel by id' })
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    const result = await this.hotalsService.findOne(id);
    return {
      message: 'Hotel fetched successfully',
      data: result,
    };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update hotel' })
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('admin'))
  @UseInterceptors(AnyFilesInterceptor(fileUpload.uploadConfig))
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() updateHotalDto: UpdateHotalDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const result = await this.hotalsService.update(id, updateHotalDto, files);
    return {
      message: 'Hotel updated successfully',
      data: result,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete hotel' })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('admin'))
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    const result = await this.hotalsService.remove(id);
    return {
      message: 'Hotel deleted successfully',
      data: result,
    };
  }
}
