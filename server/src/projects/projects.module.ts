import { Module } from '@nestjs/common';
import { CrmModule } from '../crm/crm.module';
import { ContactModule } from '../contact/contact.module';
import { ProjectsService } from './projects.service';
import { ConfigModule } from '../config/config.module';
import { AuthModule } from '../auth/auth.module';
import { ProjectsController } from './projects.controller';
import { ProjectApplicantController } from './project-applicants/project-applicant.controller';
import { ArtifactService } from '../artifacts/artifacts.service';
import { SharepointModule } from '../sharepoint/sharepoint.module';

@Module({
  imports: [
    CrmModule,
    SharepointModule,
    ConfigModule,
    ContactModule,
    AuthModule,
  ],
  providers: [ProjectsService, ArtifactService],
  exports: [ProjectsService],
  controllers: [ProjectsController, ProjectApplicantController],
})
export class ProjectsModule {}
