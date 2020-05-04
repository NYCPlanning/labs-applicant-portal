import { Module } from '@nestjs/common';
import { DocumentController } from './document.controller';
import { ConfigModule } from '../config/config.module';
import { CrmModule } from '../crm/crm.module';
import { DocumentService } from './document.service';

@Module({
  imports: [
    ConfigModule,
    CrmModule,
  ],
  providers: [
    DocumentService,
  ],
  controllers: [DocumentController],
})
export class DocumentModule {}
