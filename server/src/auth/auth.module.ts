import { Module } from '@nestjs/common';
import { ConfigModule } from '../config/config.module';
import { ContactModule } from '../contact/contact.module';
import { AuthService } from './auth.service';

@Module({
  imports: [
    ConfigModule,
    ContactModule,
  ],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
