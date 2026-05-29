import {
  Controller,
  Post,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  HttpCode,
  HttpStatus,
  Get,
  Req,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { CountryService } from './country.service';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';
import AuthGuard from 'src/app/middlewares/auth.guard';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { fileUpload } from 'src/app/helpers/fileUploder';
import type { Request } from 'express';
import pick from 'src/app/helpers/pick';

@Controller('country')
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new country',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('admin'))
  @UseInterceptors(AnyFilesInterceptor(fileUpload.uploadConfig))
  @HttpCode(HttpStatus.CREATED)
  async createCountry(
    @Body() createCountryDto: CreateCountryDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const result = await this.countryService.createCountry(
      createCountryDto,
      files,
    );
    return {
      message: 'Country created successfully',
      data: result,
    };
  }

  @Get()
  @ApiOperation({
    summary: 'Get all countries',
  })
  @ApiQuery({
    type: String,
    required: false,
    name: 'searchTerm',
    description: 'Search by country name or country code',
  })
  @ApiQuery({
    type: String,
    required: false,
    name: 'countryName',
    description: 'Search by country name',
  })
  @ApiQuery({
    type: String,
    required: false,
    name: 'countryCode',
    description: 'Search by country code',
  })
  @ApiQuery({
    type: Boolean,
    required: false,
    name: 'visaAvailable',
    description: 'Search by visa availability',
  })
  @ApiQuery({
    type: Boolean,
    required: false,
    name: 'studyAvailable',
    description: 'Search by study availability',
  })
  @ApiQuery({
    type: Boolean,
    required: false,
    name: 'popular',
    description: 'Search by popular',
  })
  @ApiQuery({
    type: String,
    required: false,
    name: 'limit',
    description: 'Limit',
  })
  @ApiQuery({
    type: String,
    required: false,
    name: 'page',
    description: 'Page',
  })
  @ApiQuery({
    type: String,
    required: false,
    name: 'sortBy',
    description: 'Sort by',
  })
  @ApiQuery({
    type: String,
    required: false,
    name: 'sortOrder',
    description: 'Sort order',
  })
  @HttpCode(HttpStatus.OK)
  async getAllCountry(@Req() req: Request) {
    const filters = pick(req.query, [
      'searchTerm',
      'countryName',
      'countryCode',
      'visaAvailable',
      'studyAvailable',
      'popular',
    ]);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
    const result = await this.countryService.getAllCountry(filters, options);
    return {
      message: 'Countries fetched successfully',
      meta: result.meta,
      data: result.data,
    };
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get single country',
  })
  @HttpCode(HttpStatus.OK)
  async getSingleCountry(@Param('id') id: string) {
    const result = await this.countryService.getSingleCountry(id);
    return {
      message: 'Country fetched successfully',
      data: result,
    };
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update country',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('admin'))
  @UseInterceptors(AnyFilesInterceptor(fileUpload.uploadConfig))
  @HttpCode(HttpStatus.OK)
  async updateCountry(
    @Param('id') id: string,
    @Body() updateCountryDto: UpdateCountryDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const result = await this.countryService.updateCountry(
      id,
      updateCountryDto,
      files,
    );
    return {
      message: 'Country updated successfully',
      data: result,
    };
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete country',
  })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('admin'))
  @HttpCode(HttpStatus.OK)
  async deleteCountry(@Param('id') id: string) {
    const result = await this.countryService.deleteCountry(id);
    return {
      message: 'Country deleted successfully',
      data: result,
    };
  }
}
