import { SetMetadata } from '@nestjs/common';

export type Relationship = 'helper' | 'self' | 'applicant-team';
export const Relationships = (...relationships: Array<Relationship>) =>
  SetMetadata('relationships', relationships);
