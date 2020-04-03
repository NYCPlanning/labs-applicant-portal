import { Module } from '@nestjs/common';
import { CrmModule } from '../crm/crm.module';
import { ContactModule } from '../contact/contact.module';
import { ContactService } from '../contact/contact.service';
import { ProjectsService } from './projects.service';
import { ConfigModule } from '../config/config.module';
import { AuthModule } from '../auth/auth.module';
import { ProjectsController } from './projects.controller';

@Module({
  imports: [
    CrmModule,
    ConfigModule,
    ContactModule,
    AuthModule,
  ],
  providers: [ProjectsService],
  exports: [ProjectsService],
  controllers: [ProjectsController],
})
export class ProjectsModule {}
