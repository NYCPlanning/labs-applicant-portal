import { 
	Controller, 
	Get, 
	Query,
	Res,
	HttpException,
	HttpStatus,
	Session,
} from '@nestjs/common';
import { Response } from 'express';
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
  // async index(@Session() session) {
  async index() {
    // TODO: build out middleware so session is accessible
    // if (!session) throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    // let { contactid } = session;

    // TODO: In the meantime, use CRM_IMPOSTER_ID for contactid
    // const contactid = this.CRM_IMPOSTER_ID;
    // console.log('imposter boop', contactid);
    // CRM_IMPOSTER_ID
    let contactid = '3380DBBD-995C-EA11-A9AF-001DD83080AB';

    if (contactid) {
      const currentUserListOfProjects = this.projectsService.findManyByContactId(contactid)

      return currentUserListOfProjects;

    }
  }
}

