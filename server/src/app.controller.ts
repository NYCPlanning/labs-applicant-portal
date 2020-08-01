import { 
  Controller, 
  Get, 
  Query,
  Res,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth/auth.service';
import { ContactService } from './contact/contact.service';

@Controller()
export class AppController {
  constructor(
    private readonly authService: AuthService,
    private readonly contactService: ContactService,
  ) {}

  @Get('/login')
  async login(@Res() res: Response, @Query('accessToken') NYCIDToken: string) {
    try {
      const ZAPToken = await this.authService.generateNewToken(NYCIDToken);
      const { contactId } = await this.authService.validateCurrentToken(ZAPToken);
      const { emailaddress1 } = await this.contactService.findOneById(contactId);

      res.send({
        access_token: ZAPToken,
        emailaddress1,
      });
    } catch (e) {
      if (e instanceof HttpException) {
        res.status(401).send({ errors: [e] });
      } else {
        console.log(e);

        res.status(500).send({ errors: [e] });
      }
    }
  }
}

