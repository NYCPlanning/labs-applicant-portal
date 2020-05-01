import { Module } from '@nestjs/common';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';
import { ConfigModule } from '../config/config.module';
import { CrmModule } from '../crm/crm.module';

@Module({
  imports: [
    ConfigModule,
    CrmModule,
  ],
  providers: [DocumentService],
  controllers: [DocumentController],
})
export class DocumentModule {}
