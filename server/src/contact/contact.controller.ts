import { Controller, Session, Res, Query, Get } from '@nestjs/common';
import { Serializer } from 'jsonapi-serializer';
import { ContactService } from './contact.service';

@Controller('contacts')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Get('/')
  async getUser(@Session() session, @Res() res, @Query('me') me) {
    const { contactId } = session;

    if (!contactId) {
      res.status(401).send({
        errors: ['Authentication required for this route'],
      });
    } else {
      const contact = await this.contactService.findOneById(contactId);

      res.send(this.serialize(me ? contact : [contact]));
    }
  }

  // Serializes an array of objects into a JSON:API document
  serialize(records, opts?: object): Serializer {
    const ContactSerializer = new Serializer('contacts', {
      attributes: ['contactid', 'emailaddress1'],
      // TODO: annoying. the JWT/cookie is camelcase but CRM isn't.
      id: 'contactid',
      meta: { ...opts },
    });

    return ContactSerializer.serialize(records);
  }
}
