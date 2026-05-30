import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  Req,
  Put,
} from '@nestjs/common';
import { FaqService } from './faq.service';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import AuthGuard from 'src/app/middlewares/auth.guard';
import type { Request } from 'express';
import pick from 'src/app/helpers/pick';

@ApiTags('FAQ')
@Controller('faq')
export class FaqController {
  constructor(private readonly faqService: FaqService) {}

  @Post()
  @ApiOperation({
    summary: 'Create FAQ',
  })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('admin'))
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createFaqDto: CreateFaqDto) {
    const result = await this.faqService.create(createFaqDto);
    return {
      message: 'FAQ created successfully',
      data: result,
    };
  }

  @Get()
  @ApiOperation({
    summary: 'Get all FAQs',
  })
  @ApiQuery({
    name: 'searchTerm',
    required: false,
    description: 'Search term',
  })
  @ApiQuery({
    name: 'question',
    required: false,
    description: 'Question',
  })
  @ApiQuery({
    name: 'answer',
    required: false,
    description: 'Answer',
  })
  @ApiQuery({
    name: 'category',
    required: false,
    description: 'Category',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Limit',
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    description: 'Sort by',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    description: 'Sort order',
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@Req() req: Request) {
    const filters = pick(req.query, [
      'searchTerm',
      'question',
      'answer',
      'category',
    ]);
    const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);
    const result = await this.faqService.findAll(filters, options);
    return {
      message: 'FAQs fetched successfully',
      meta: result.meta,
      data: result.data,
    };
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get FAQ by id',
  })
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    const result = await this.faqService.findOne(id);
    return {
      message: 'FAQ fetched successfully',
      data: result,
    };
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update FAQ',
  })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('admin'))
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() updateFaqDto: UpdateFaqDto,
  ) {
    const result = await this.faqService.update(id, updateFaqDto);
    return {
      message: 'FAQ updated successfully',
      data: result,
    };
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete FAQ',
  })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('admin'))
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    const result = await this.faqService.remove(id);
    return {
      message: 'FAQ deleted successfully',
      data: result,
    };
  }
}
