import { Controller, Session, Get, UseInterceptors, HttpException, HttpStatus } from '@nestjs/common';
import { ContactService } from './contact.service';
import { JsonApiSerializeInterceptor } from '../json-api-serialize.interceptor';


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
}
