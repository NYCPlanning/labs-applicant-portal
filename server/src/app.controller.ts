import { 
  Controller, 
  Get, 
  Query,
  Res,
  Session,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth/auth.service';
import { ContactService } from './contact/contact.service';
import { Serializer } from 'jsonapi-serializer';

@Controller()
export class AppController {
  constructor(
    private readonly authService: AuthService,
    private readonly contactService: ContactService
  ) {}

  @Get('/login')
  async login(@Res() res: Response, @Query('accessToken') NYCIDToken: string) {
    try {
      const ZAPToken = await this.authService.generateNewToken(NYCIDToken);

      res.cookie('token', ZAPToken, { httpOnly: true })
        .send({ message: 'Login successful!' });
    } catch (e) {
      if (e instanceof HttpException) {
        res.status(401).send({ errors: [e] });
      } else {
        console.log(e);

        res.status(500).send({ errors: [e] });
      }
    }
  }

  @Get('/users')
  async getUser(@Session() session, @Res() res) {
    const { contactId } = session;

    if (!contactId) {
      res.status(401).send({
        errors: ['Authentication required for this route'],
      });
    } else {
      const contact = await this.contactService.findOneById(contactId);

      res.send(this.serialize([contact]));
    }
  }

  // Serializes an array of objects into a JSON:API document
  serialize(records, opts?: object): Serializer {
    const UserSerializer = new Serializer('users', {
      attributes: ['contactId', 'emailaddress1'],
      id: 'contactId',
      meta: { ...opts },
    });

    return UserSerializer.serialize(records);
  }
}

