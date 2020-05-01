import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { Deserializer } from 'jsonapi-serializer';

@Injectable()
export class JsonApiDeserializePipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const { type } = metadata;

    if (type === 'body') {
      return new Deserializer({
        keyForAttribute: 'snake_case',
      }).deserialize(value);
    }

    return value;
  }
}
