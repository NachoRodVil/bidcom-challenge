import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type MaskedUrlDocument = MaskedUrl & Document;

@Schema()
export class MaskedUrl {
  @Prop({ required: true })
  target: string;

  @Prop({ required: true, unique: true })
  link: string;

  @Prop({ required: true, default: true })
  valid: boolean;

  @Prop({ required: true, default: 0 })
  redirectionCount: number;

  @Prop()
  password?: string;

  @Prop()
  expiresAt?: Date;
}

export const MaskedUrlSchema = SchemaFactory.createForClass(MaskedUrl);
