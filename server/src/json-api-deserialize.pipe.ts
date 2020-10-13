import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { Deserializer } from 'jsonapi-serializer';
import { underscore } from 'inflected';

@Injectable()
export class JsonApiDeserializePipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const { type } = metadata;

    if (type === 'body') {
      return new Deserializer({
        keyForAttribute: (attribute) => {
          // One-off deserialization for any properties should happen here.
          // Add another if statement.
          // See https://github.com/NYCPlanning/labs-applicant-portal/pull/771
          // TODO: Extract out and modularize the set of one-offs if it grows
          // beyond 2.
          if (attribute === 'dcp500kpluszone')
            return 'dcp_500kpluszone';
          return underscore(attribute);
        },
        packages: {
          valueForRelationship: relationship => relationship.id,
        },
        'pas-forms': {
          valueForRelationship: relationship => relationship.id,
        },
        'landuse-forms': {
          valueForRelationship: relationship => relationship.id,
        },
        bbls: {
          valueForRelationship: relationship => relationship.id,
        },
        applicants: {
          valueForRelationship: relationship => relationship.id,
        },
        projects: {
          valueForRelationship: relationship => relationship.id,
        },
        'project-applicants': {
          valueForRelationship: relationship => relationship.id,
        },
        contacts: {
          valueForRelationship: relationship => relationship.id,
        },
        'related-actions': {
          valueForRelationship: relationship => relationship.id,
        },
        'affected-zoning-resolutions': {
          valueForRelationship: relationship => relationship.id,
        },
        'zoning-map-changes': {
          valueForRelationship: relationship => relationship.id,
        },
      }).deserialize(value);
    }

    return value;
  }
}
