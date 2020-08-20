import { Controller, Session, Get, UseInterceptors, HttpException, HttpStatus, Post, Body } from '@nestjs/common';
import { pick } from 'underscore';
import { ContactService } from './contact.service';
import { JsonApiSerializeInterceptor } from '../json-api-serialize.interceptor';
import { CONTACT_ATTRS } from './contacts.attrs';

@UseInterceptors(new JsonApiSerializeInterceptor('contacts', {
  attributes: ['contactid', 'emailaddress1'],
  id: 'contactid',
}))
@Controller('contacts')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Get('/')
  async getContact(@Session() session) {
    const { contactId } = session;

    if (!contactId) {
      throw new HttpException(
        'Authentication required for this route',
        HttpStatus.UNAUTHORIZED,
      );
    } else {
      return this.contactService.findOneById(contactId);
    }
  }

  @Post('/')
  create(@Body() body) {
    console.log('marsh', body);
    const { emailaddress1 } = body.data.attributes;
    console.log('swamp', emailaddress1);

    return this.contactService.createContact(emailaddress1, body);
  }
}
