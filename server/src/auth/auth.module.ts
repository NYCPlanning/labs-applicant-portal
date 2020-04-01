import { Module } from '@nestjs/common';
import { ConfigModule } from '../config/config.module';
import { ContactModule } from '../contact/contact.module';
import { ConfigService } from '../config/config.service';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';

@Module({
  imports: [
    ConfigModule,
    ContactModule,
  ],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {
  SKIP_AUTH = false;
  CRM_IMPOSTER_EMAIL = 'labs_dl@planning.nyc.gov';

 constructor(private readonly config: ConfigService) {
    this.SKIP_AUTH = this.config.get('SKIP_AUTH');
    this.CRM_IMPOSTER_EMAIL = this.config.get('CRM_IMPOSTER_EMAIL');
    this.NYCID_TOKEN_SECRET = this.config.get('NYCID_TOKEN_SECRET');
  }

 onApplicationBootstrap() {
    if (this.SKIP_AUTH) {
      this._printCookieInConsole();
    }
  }

  _printCookieInConsole() {
    const { NYCID_TOKEN_SECRET, CRM_IMPOSTER_EMAIL } = this;
    const mockNycIdToken = jwt.sign({
      mail: CRM_IMPOSTER_EMAIL,
      exp: 1565932329 * 100,
    }, NYCID_TOKEN_SECRET);

    // this hook gets called before the server is actually ready,
    // so delay the fetch a few seconds. TODO: make better.
    setTimeout(async () => {
      console.log('generating cookie...');

      const response = await superagent.get(`http://localhost:3000/login?accessToken=${mockNycIdToken}`);
      const { header: { 'set-cookie': [, token] } } = response;

      console.log(`SKIP_AUTH is true! The cookie token is ${token}. Add this to your request headers.`);
    }, 3000);
  }

}