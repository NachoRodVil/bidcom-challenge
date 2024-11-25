import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LinksModule } from './links/links.module';

@Module({
  imports: [MongooseModule.forRoot(process.env.MONGODB_URL), LinksModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
