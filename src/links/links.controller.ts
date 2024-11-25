import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  Put,
  Redirect,
  Query,
  Res,
} from '@nestjs/common';
import { LinksService } from './links.service';
import { createMaskedUrlBody } from './dto/createMaskedUrl.dto';

@Controller('/')
export class LinksController {
  constructor(private readonly linksService: LinksService) {}

  @Post('create')
  async createMaskedUrl(@Body() createMaskedUrlBody: createMaskedUrlBody) {
    try {
      return await this.linksService.createMaskedUrl(createMaskedUrlBody);
    } catch (e) {
      throw new HttpException(e.message, e.status || HttpStatus.BAD_REQUEST);
    }
  }

  @Get('/l/:linkEnd')
  @Redirect()
  async getMaskedUrl(
    @Param('linkEnd') linkEnd: string,
    @Query('password') password: string,
  ) {
    return await this.linksService.returnRedirectingUrl(linkEnd, password);
  }

  @Put('/l/:linkEnd')
  async disableMaskedUrl(@Param('linkEnd') linkEnd: string) {
    return await this.linksService.disableMaskedUrl(linkEnd);
  }

  @Get('/:linkEnd/stats')
  async getStats(@Param('linkEnd') linkEnd: string) {
    return await this.linksService.getStats(linkEnd);
  }
}
