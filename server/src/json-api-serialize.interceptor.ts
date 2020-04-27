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
      keyForAttribute(key) {
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
