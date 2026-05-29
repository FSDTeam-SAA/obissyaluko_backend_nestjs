import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Put,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ProgramsService } from './programs.service';
import { CreateProgramDto } from './dto/create-program.dto';
import { UpdateProgramDto } from './dto/update-program.dto';
import type { Request } from 'express';
import pick from 'src/app/helpers/pick';
import { ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import AuthGuard from 'src/app/middlewares/auth.guard';

@Controller('programs')
export class ProgramsController {
  constructor(private readonly programsService: ProgramsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create program',
  })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('admin'))
  @HttpCode(HttpStatus.CREATED)
  async createProgram(@Body() createProgramDto: CreateProgramDto) {
    const result = await this.programsService.createProgram(createProgramDto);
    return {
      message: 'Program created successfully',
      data: result,
    };
  }

  @Get()
  @ApiOperation({
    summary: 'Get all programs',
  })
  @ApiQuery({
    name: 'searchTerm',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'programName',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'degreeLevel',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'duration',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'eligibility',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'requirements',
    required: false,
    type: String,
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
    name: 'university',
    required: false,
    type: String,
  })
  @ApiOperation({
    summary: 'Get all programs',
  })
  @HttpCode(HttpStatus.OK)
  async getAllPrograms(@Req() req: Request) {
    const filters = pick(req.query, [
      'searchTerm',
      'programName',
      'degreeLevel',
      'duration',
      'eligibility',
      'requirements',
    ]);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
    const result = await this.programsService.getAllPrograms(filters, options);
    return {
      message: 'Programs fetched successfully',
      meta: result.meta,
      data: result.data,
    };
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get single program',
  })
  @HttpCode(HttpStatus.OK)
  async getSingleProgram(@Param('id') id: string) {
    const result = await this.programsService.getSingleProgram(id);
    return {
      message: 'Program fetched successfully',
      data: result,
    };
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update program',
  })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('admin'))
  @HttpCode(HttpStatus.OK)
  async updateProgram(
    @Param('id') id: string,
    @Body() updateProgramDto: UpdateProgramDto,
  ) {
    const result = await this.programsService.updateProgram(
      id,
      updateProgramDto,
    );
    return {
      message: 'Program updated successfully',
      data: result,
    };
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete program',
  })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('admin'))
  @HttpCode(HttpStatus.OK)
  async deleteProgram(@Param('id') id: string) {
    const result = await this.programsService.deleteProgram(id);
    return {
      message: 'Program deleted successfully',
      data: result,
    };
  }
}
