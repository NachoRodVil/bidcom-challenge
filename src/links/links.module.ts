import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { MaskedUrlSchema } from "./schema/maskedUrls.schema";
import { LinksController } from "./links.controller";
import { LinksService } from "./links.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: "MaskedUrls",
        schema: MaskedUrlSchema,
      },
    ]),
  ],
  controllers: [LinksController],
  providers: [LinksService],
})
export class LinksModule {}
