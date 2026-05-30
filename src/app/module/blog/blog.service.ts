import { HttpException, Injectable } from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument } from './entities/blog.entity';
import { Model } from 'mongoose';
import { fileUpload } from 'src/app/helpers/fileUploder';
import { IFilterParams } from 'src/app/helpers/pick';
import paginationHelper, { IOptions } from 'src/app/helpers/pagenation';
import buildWhereConditions from 'src/app/helpers/buildWhereConditions';

@Injectable()
export class BlogService {
  constructor(
    @InjectModel(Blog.name) private readonly blogModel: Model<BlogDocument>,
  ) {}
  async createBlog(createBlogDto: CreateBlogDto, file: Express.Multer.File) {
    const blog = await this.blogModel.findOne({ title: createBlogDto.title });
    if (blog) {
      throw new HttpException('Blog already exists', 400);
    }
    const uploaded = await fileUpload.uploadToCloudinary(file);
    createBlogDto.image = uploaded.url;
    const result = await this.blogModel.create(createBlogDto);
    return result;
  }

  async findAll(params: IFilterParams, options: IOptions) {
    const { limit, page, skip, sortBy, sortOrder } = paginationHelper(options);
    const whereConditions = buildWhereConditions(params, [
      'title',
      'description',
      'category',
    ]);
    const total = await this.blogModel.countDocuments(whereConditions);
    const blogs = await this.blogModel
      .find(whereConditions)
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortOrder });
    return { meta: { page, limit, total }, data: blogs };
  }

  async findOne(id: string) {
    const blog = await this.blogModel.findById(id);
    if (!blog) {
      throw new HttpException('Blog not found', 404);
    }
    return blog;
  }

  async update(
    id: string,
    updateBlogDto: UpdateBlogDto,
    file?: Express.Multer.File,
  ) {
    const blog = await this.blogModel.findById(id);
    if (!blog) {
      throw new HttpException('Blog not found', 404);
    }
    if (file) {
      const uploaded = await fileUpload.uploadToCloudinary(file);
      updateBlogDto.image = uploaded.url;
    }
    const result = await this.blogModel.findByIdAndUpdate(id, updateBlogDto, {
      new: true,
    });
    return result;
  }

  async remove(id: string) {
    const blog = await this.blogModel.findById(id);
    if (!blog) {
      throw new HttpException('Blog not found', 404);
    }
    const result = await this.blogModel.findByIdAndDelete(id);
    return result;
  }
}
