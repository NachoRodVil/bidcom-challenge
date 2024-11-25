import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { MaskedUrl } from './schema/maskedUrls.schema';
import { createMaskedUrlBody } from './dto/createMaskedUrl.dto';
import { hashPassword, verifyHashedPassword } from 'src/util/passwordHandler';
import { createLink, urlCreate } from 'src/util/urlCreation';
import { creationResponseBody } from './dto/creationResponseBody.dto';

@Injectable()
export class LinksService {
  constructor(
    @InjectModel('MaskedUrls') private LinksModule: Model<MaskedUrl>,
  ) {}

  async createMaskedUrl(
    createMaskedUrlBody: createMaskedUrlBody,
  ): Promise<creationResponseBody> {
    const newMaskedUrl = {
      link: urlCreate(),
      target: createMaskedUrlBody.target,
      password: createMaskedUrlBody.password
        ? hashPassword(createMaskedUrlBody.password)
        : '',
      valid: true,
      expiresAt: createMaskedUrlBody.expiresAt
        ? new Date(createMaskedUrlBody.expiresAt)
        : null,
    };
    try {
      const maskedUrl = new this.LinksModule(newMaskedUrl);
      await maskedUrl.save();
      return {
        target: maskedUrl.target,
        link: createLink(maskedUrl.link),
        valid: true,
      };
    } catch (e) {
      throw new HttpException('Error al crear link', HttpStatus.BAD_REQUEST);
    }
  }

  async returnRedirectingUrl(linkEnd: string, password?: string) {
    try {
      const link = await this.LinksModule.findOne({
        link: linkEnd,
      });
      if (!link || !link.valid) {
        throw new NotFoundException('Link inexistente o inválido');
      }

      if (link.expiresAt && link.expiresAt < new Date()) {
        link.valid = false;
        await link.save();
        throw new NotFoundException('Link inexistente o inválido');
      }
      if (link.password && !password) {
        throw new HttpException(
          'Se requiere contraseña para acceder al link',
          HttpStatus.UNAUTHORIZED,
        );
      } else if (link.password && password) {
        if (!verifyHashedPassword(password, link.password)) {
          throw new HttpException(
            'Contraseña incorrecta',
            HttpStatus.UNAUTHORIZED,
          );
        }
      }
      link.redirectionCount += 1;
      await link.save();
      return { url: link.target };
    } catch (e) {
      throw new HttpException(e.response.message, e.status || 500);
    }
  }

  async getStats(linkEnd: string) {
    try {
      const link = await this.LinksModule.findOne({
        link: linkEnd,
      });
      if (!link) {
        throw new NotFoundException('Link inexistente o inválido');
      }
      return link.redirectionCount;
    } catch (e) {
      throw new HttpException(e.response.message, e.status || 500);
    }
  }

  async disableMaskedUrl(linkEnd: string) {
    try {
      const link = await this.LinksModule.findOne({
        link: linkEnd,
      });
      if (!link) {
        throw new NotFoundException('Link inexistente o inválido');
      }
      link.valid = false;
      await link.save();
      return 'Link deshabilitado';
    } catch (e) {
      throw new HttpException(e.response.message, e.status || 500);
    }
  }
}
