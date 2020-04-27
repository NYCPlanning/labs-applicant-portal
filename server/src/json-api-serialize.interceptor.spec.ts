import { JsonApiSerializeInterceptor } from './json-api-serialize.interceptor';

describe('JsonApiSerializeInterceptor', () => {
  it('should be defined', () => {
    expect(new JsonApiSerializeInterceptor('projects', {})).toBeDefined();
  });
});
