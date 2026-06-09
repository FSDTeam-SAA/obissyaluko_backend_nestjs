import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { VisaApplyService } from './visa-apply.service';
import { CreateVisaApplyDto } from './dto/create-visa-apply.dto';
import { UpdateVisaApplyDto } from './dto/update-visa-apply.dto';
import { ApiBearerAuth, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import AuthGuard from 'src/app/middlewares/auth.guard';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { fileUpload } from 'src/app/helpers/fileUploder';
import type { Request } from 'express';

@Controller('visa-apply')
export class VisaApplyController {
  constructor(private readonly visaApplyService: VisaApplyService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new visa application',
  })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('user'))
  @UseInterceptors(AnyFilesInterceptor(fileUpload.uploadConfig))
  @ApiConsumes('multipart/form-data')
  @HttpCode(HttpStatus.CREATED)
  create(
    @Req() req: Request,
    @Body() createVisaApplyDto: CreateVisaApplyDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.visaApplyService.applyForVisa(
      req.user!.id,
      createVisaApplyDto,
      files,
    );
  }

 
}
