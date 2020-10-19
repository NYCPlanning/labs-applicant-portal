import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Serializer } from 'jsonapi-serializer';
import { map } from 'rxjs/operators';
import { dasherize } from 'inflected';

// Generic interceptor for converting data into JSON:API spec
@Injectable()
export class JsonApiSerializeInterceptor implements NestInterceptor {
  serializer: Serializer;

  constructor(resourceName, serializationOptions) {
    this.serializer = new Serializer(resourceName, {
      ...serializationOptions,

      // REDO: we should just make the client support dash prefixes
      // because it'll be tough when we have to deserialize
      keyForAttribute(key) {
        // One-off serialization for any properties should happen here.
        // Add another if statement.
        // See https://github.com/NYCPlanning/labs-applicant-portal/pull/771
        // TODO: Extract out and modularize the set of one-offs if it grows
        // beyond 2.
        if (key === 'dcp_500kpluszone') {
          return 'dcp500kpluszone';
        }

        let dasherized = dasherize(key);

        if (dasherized[0] === '-') {
          dasherized = dasherized.substring(1);
        }

        return dasherized;
      },
    });
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(data => this.serializer.serialize(data)),
    );
  }
}
