import { Controller, Session, Get, UseInterceptors, HttpException, HttpStatus, Query } from '@nestjs/common';
import { CONTACT_ATTRS } from './contacts.attrs';
import { ContactService } from './contact.service';
import { JsonApiSerializeInterceptor } from '../json-api-serialize.interceptor';


@UseInterceptors(new JsonApiSerializeInterceptor('contacts', {
  attributes: [
    ...CONTACT_ATTRS,

    'is_nycid_validated', // merged attribute from NYCID response object
    'is_nycid_email_registered', // inferred attribute from NYCID response object
    'has_crm_contact', // virtual property to denote whether contact has a crm contact record
    'is_city_employee', // virtual property to denote whether user is employee
    'has_logged_in_once',
  ],
  id: 'contactid',
}))
@Controller('contacts')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Get('/')
  async getContact(@Session() session, @Query('me') me, @Query('email') email) {
    // if this is a self-check, lookup the contact id from session
    if (me) {
      const { contactId } = session;

      if (!contactId) {
        throw new HttpException(
          'Authentication required for this route',
          HttpStatus.UNAUTHORIZED,
        );
      } else {
        return this.contactService.findOneById(contactId);
      }
    } else {
      return this.contactService.findOneByEmail(email);
    }
  }
}
