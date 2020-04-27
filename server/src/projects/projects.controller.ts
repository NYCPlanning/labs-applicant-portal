import {
  Controller,
  Get,
  Query,
  HttpException,
  HttpStatus,
  Session,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ConfigService } from '../config/config.service';
import { ContactService } from '../contact/contact.service';
import { AuthService } from '../auth/auth.service';

@Controller()
export class ProjectsController {
  CRM_IMPOSTER_ID = '';

  constructor(
    private readonly projectsService: ProjectsService,
    private readonly contactService: ContactService,
    private readonly authService: AuthService,
    private readonly config: ConfigService,
  ) {
    this.CRM_IMPOSTER_ID = this.config.get('CRM_IMPOSTER_ID');
  }

  @Get('/projects')
  async listOfCurrentUserProjects(@Session() session, @Query('email') email) {
    let { contactId } = session;

    // TODO: Use a NestJS interceptor object or something to help with this
    if (!contactId)
      throw new HttpException(
        'Unauthorized. Please login.',
        HttpStatus.UNAUTHORIZED,
      );

    if (email) {
      ({ contactid: contactId } = await this.contactService.findOneByEmail(
        email,
      ));
    }

    try {
      if (contactId) {
        return this.projectsService.findManyByContactId(contactId);
      }
    } catch (e) {
      const errorMessage = `${e}`;

      throw new HttpException(errorMessage, HttpStatus.BAD_REQUEST);
    }
  }
}
