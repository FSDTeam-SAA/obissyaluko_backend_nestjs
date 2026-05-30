import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BlogDocument = HydratedDocument<Blog>;

@Schema({ timestamps: true })
export class Blog {
  @Prop()
  title: string;

  @Prop()
  excerpt: string;

  @Prop()
  image: string;

  @Prop()
  content: string;

  @Prop()
  category: string;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
