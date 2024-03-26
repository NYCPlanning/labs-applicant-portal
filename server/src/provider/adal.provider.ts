import { FactoryProvider } from '@nestjs/common';
import { ConfigService } from 'src/config/config.service';
import { AuthenticationContext, TokenResponse } from 'adal-node';

export type AdalProviderType = {
  host: string;
  acquireToken: () => Promise<string>;
};

export const ADAL_SERVICE = Symbol('ADAL_SERVICE');
export const AdalProvider: FactoryProvider<AdalProviderType> = {
  provide: ADAL_SERVICE,
  inject: [ConfigService],
  useFactory: (config: ConfigService) => {
    const crmHost: string | undefined = config.get('CRM_HOST');
    if (crmHost === undefined) throw new Error('Missing CRM HOST');

    const crmUrlPath: string | undefined = config.get('CRM_URL_PATH');
    if (crmUrlPath === undefined) throw new Error('Missing CRM URL PATH');

    const clientId: string | undefined = config.get('CLIENT_ID');
    if (clientId === undefined) throw new Error('Missing Client Id');

    const clientSecret: string | undefined = config.get('CLIENT_SECRET');
    if (clientSecret === undefined) throw new Error('Missing Client Secret');

    const tenantId: string | undefined = config.get('TENANT_ID');
    if (tenantId === undefined) throw new Error('Missing Tenant Id');

    const authorityHostUrl: string | undefined =
      config.get('AUTHORITY_HOST_URL');
    if (authorityHostUrl === undefined)
      throw new Error('Missing Authority Host Url');

    const tokenPath: string | undefined = config.get('TOKEN_PATH');
    if (tokenPath === undefined) throw new Error('Missing Token Path');

    const host = `${crmHost}${crmUrlPath}`;

    let tokenCache: string | null = null;
    let expirationDate: Date | null = null;
    const acquireToken  = () => {
      return new Promise((resolve: (value: string) => void, reject: (reason: string) => void) => {
        if (tokenCache !== null && expirationDate !== null) {
          const tokenLimit = new Date(
            expirationDate.getTime() - 15 * 60 * 1000,
          );
          const now = new Date();
          if (now <= tokenLimit) {
            resolve(tokenCache);
          }
        }

        const authenticationPath = `${authorityHostUrl}/${tenantId}${tokenPath}`;
        const authCtx = new AuthenticationContext(authenticationPath);
        authCtx.acquireTokenWithClientCredentials(
          crmHost,
          clientId,
          clientSecret,
          (error, tokenResponse) => {
            if (error !== undefined) {
              reject('error requesting crm token');
            }
            if (tokenResponse?.error !== undefined){
              reject("error receiving crm token");
            }
            
            const { accessToken, expiresOn } = tokenResponse as TokenResponse;
            tokenCache = accessToken;
            expirationDate =
              typeof expiresOn === 'string' ? new Date(expiresOn) : expiresOn;
            resolve(tokenCache);
          },
        );
      });
    };
    return {
      host,
      acquireToken,
    };
  },
};
