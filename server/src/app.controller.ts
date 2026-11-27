import {
  Controller,
  Get,
  Query,
  Res,
  HttpException,
  HttpStatus,
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
  async login(
    @Query("code") code: string,
    @Query("codeVerifier") codeVerifier: string,
    @Query("redirectUri") redirectUri: string,
    @Res() res
  ) {
    try {
      const {
        ZAPToken,
        idTokenClaims,
        contactId
      } = await this.authService.generateNewTokenFromCode(
        code,
        codeVerifier,
        redirectUri
      );

      console.log("idTokenClaims", idTokenClaims);
      const { email, sub, given_name, family_name } = idTokenClaims;
      const { emailaddress1 } =
        await this.contactService.findOneById(contactId);

      res.status(HttpStatus.OK).json({
        access_token: ZAPToken,
        nycid: { email, sub, given_name, family_name },
        contactId: contactId,
        emailaddress1,
      });
    } catch (e) {
      console.log("ERROR GENERATING TOKEN", e);
      if (e instanceof HttpException) {
        res.status(e.getStatus()).send({ errors: [e] });
      } else {
        res.status(500).send({ errors: [e] });
      }
    }
  }
   
}
