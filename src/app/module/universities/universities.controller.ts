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
import { UniversitiesService } from './universities.service';
import { CreateUniversityDto } from './dto/create-university.dto';
import { UpdateUniversityDto } from './dto/update-university.dto';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { fileUpload } from 'src/app/helpers/fileUploder';
import AuthGuard from 'src/app/middlewares/auth.guard';
import type { Request } from 'express';
import pick from 'src/app/helpers/pick';

@Controller('universities')
export class UniversitiesController {
  constructor(private readonly universitiesService: UniversitiesService) {}

  @Post()
  @ApiOperation({
    summary: 'create university',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('admin'))
  @UseInterceptors(AnyFilesInterceptor(fileUpload.uploadConfig))
  @HttpCode(HttpStatus.CREATED)
  async createUniversity(
    @Body() createUniversityDto: CreateUniversityDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const res = await this.universitiesService.createUniversity(
      createUniversityDto,
      files,
    );
    return {
      success: true,
      message: 'University created successfully',
      data: res,
    };
  }

  @Get()
  @ApiOperation({
    summary: 'get all universities',
  })
  @ApiQuery({
    name: 'searchTerm',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'country',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'ranking',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'description',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'website',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    type: String,
  })
  @HttpCode(HttpStatus.OK)
  async getAllUniversities(@Req() req: Request) {
    const filters = pick(req.query, [
      'searchTerm',
      'country',
      'ranking',
      'description',
      'website',
    ]);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
    const result = await this.universitiesService.getAllUniversities(
      filters,
      options,
    );
    return {
      success: true,
      message: 'Universities fetched successfully',
      meta: result.meta,
      data: result.data,
    };
  }

  @Get(':id')
  @ApiOperation({
    summary: 'get single university',
  })
  @HttpCode(HttpStatus.OK)
  async getSingleUniversity(@Param('id') id: string) {
    const result = await this.universitiesService.getSingleUniversity(id);
    return {
      success: true,
      message: 'University fetched successfully',
      data: result,
    };
  }

  @Put(':id')
  @ApiOperation({
    summary: 'update university',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('admin'))
  @UseInterceptors(AnyFilesInterceptor(fileUpload.uploadConfig))
  @HttpCode(HttpStatus.OK)
  async updateUniversity(
    @Param('id') id: string,
    @Body() updateUniversityDto: UpdateUniversityDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const result = await this.universitiesService.updateUniversity(
      id,
      updateUniversityDto,
      files,
    );
    return {
      success: true,
      message: 'University updated successfully',
      data: result,
    };
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'delete university',
  })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('admin'))
  @HttpCode(HttpStatus.OK)
  async deleteUniversity(@Param('id') id: string) {
    const result = await this.universitiesService.deleteUniversity(id);
    return {
      success: true,
      message: 'University deleted successfully',
      data: result,
    };
  }
}
