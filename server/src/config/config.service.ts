import dotenv from 'dotenv';
import fs from 'fs';
import { Injectable } from '@nestjs/common';

/**
 * This service is responsible for saturating app environment variables
 * from the node process or from local .env files
 *
 * @class      ConfigService (name)
 */
@Injectable()
export class ConfigService {
  private readonly envConfig: { [key: string]: string } = {};

  constructor(filePath: string) {
    if (
      process.env.NODE_ENV === 'production' ||
      process.env.NODE_ENV === 'test'
    ) {
      this.envConfig = process.env;
    } else {
      try {
        const envFile = dotenv.parse(fs.readFileSync(filePath)) || {};

        this.envConfig = { ...process.env, ...envFile };
      } catch (e) {
        // fallback to whatever the environment is
        this.envConfig = process.env;
      }
    }
  }

  get(key: string): any {
    return this.envConfig[key];
  }

  get featureFlag() {
    return {
      selfService: this.envConfig['FEATURE_FLAG_SELF_SERVICE'] === 'ON',
      creeper: this.envConfig['FEATURE_FLAG_CREEPER'] === 'ON',
    };
  }
}
