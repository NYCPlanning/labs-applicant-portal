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
import { ContactService } from '../contact/contact.service';
import { AuthService } from '../auth/auth.service';

@Controller()
export class ProjectsController {
  constructor(
  	private readonly projectsService: ProjectsService,
  	private readonly contactService: ContactService,
  	private readonly authService: AuthService,
  ) {}

  @Get('/projects')
  async index(@Session() session) {
    // if (!session) throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);

    // CRM_IMPOSTER_ID
    let contactid = 'a42c6343-455a-ea11-a9a8-001dd8308047';

    if (contactid) {
    	console.log('is there a contactid walnut?');

      const currentUserListOfProjects = this.projectsService.findManyByContactId(contactid)

      return currentUserListOfProjects;
    }
  }

  // @Get('/projects')
  // async getListOfProjectsByContact(@Res() res: Response) {
  //   try {
  //     // I'm assuming we'll want to already have this stored in the app
  //     const contactId = this.authService.get('currentContactId');
  //     const currentUserProjects = await this.projectsService.findManyByContactId(contactId);

  //     res.status(201).send({
  //       message: 'success getting projects list for contact',
  //     });
  //   } catch (e) {
  //     if (e instanceof HttpException) {
  //       res.status(401).send({ errors: [e] });
  //     } else {
  //       console.log(e);

  //       res.status(500).send({ errors: [e] });
  //     }
  //   }
  // }
}

