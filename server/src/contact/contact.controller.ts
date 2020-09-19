import { Controller, Session, Get, UseInterceptors, HttpException, HttpStatus, Query, Patch, UseGuards, UsePipes, Body, Param } from '@nestjs/common';
import { ContactService } from './contact.service';
import { JsonApiSerializeInterceptor } from '../json-api-serialize.interceptor';
import { CONTACT_ATTRS } from './contacts.attrs';
import { AuthenticateGuard } from '../authenticate.guard';
import { JsonApiDeserializePipe } from '../json-api-deserialize.pipe';
import { NycidService } from './nycid/nycid.service';

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
  constructor(
    private readonly contactService: ContactService,
    private readonly nycidService: NycidService,
  ) {}

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

  @UseGuards(AuthenticateGuard)
  @UsePipes(JsonApiDeserializePipe)
  @Patch('/:id')
  async update(@Param('id') id, @Session() session, @Body() body) {
    const { NYCIDToken } = session;

    return this.contactService.synchronize(id, NYCIDToken);
  }

  @UseGuards(AuthenticateGuard)
  @Get('/:id')
  async find(@Param('id') id) {
    return this.contactService.findOneById(id);
  }
}
