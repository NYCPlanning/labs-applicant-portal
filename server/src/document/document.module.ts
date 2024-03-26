import { Module } from '@nestjs/common';
import { DocumentController } from './document.controller';
import { ConfigModule } from '../config/config.module';
import { CrmModule } from '../crm/crm.module';
import { DocumentService } from './document.service';
import { SharepointModule } from '../sharepoint/sharepoint.module';
import { AdalProvider } from 'src/provider/adal.provider';

@Module({
  imports: [ConfigModule, CrmModule, SharepointModule],
  providers: [DocumentService, AdalProvider],
  exports: [DocumentService],
  controllers: [DocumentController],
})
export class DocumentModule {}
