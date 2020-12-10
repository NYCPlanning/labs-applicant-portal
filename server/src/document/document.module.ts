import { Module } from '@nestjs/common';
import { DocumentController } from './document.controller';
import { ConfigModule } from '../config/config.module';
import { CrmModule } from '../crm/crm.module';
import { DocumentService } from './document.service';
import { SharepointModule } from '../sharepoint/sharepoint.module';

@Module({
  imports: [
    ConfigModule,
    CrmModule,
    SharepointModule,
  ],
  providers: [
    DocumentService,
  ],
  exports: [
    DocumentService,
  ],
  controllers: [DocumentController],
})
export class DocumentModule {}
