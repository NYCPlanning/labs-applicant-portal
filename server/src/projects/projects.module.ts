import { Module } from '@nestjs/common';
import { CrmModule } from '../crm/crm.module';
import { ContactModule } from '../contact/contact.module';
import { ProjectsService } from './projects.service';
import { ConfigModule } from '../config/config.module';
import { AuthModule } from '../auth/auth.module';
import { ProjectsController } from './projects.controller';
import { ProjectApplicantController } from './project-applicants/project-applicant.controller';
import { DocumentModule } from '../document/document.module';

@Module({
  imports: [
    AuthModule,
    CrmModule,
    ConfigModule,
    ContactModule,
    DocumentModule,
  ],
  providers: [ProjectsService],
  exports: [ProjectsService],
  controllers: [ProjectsController, ProjectApplicantController],
})
export class ProjectsModule {}
