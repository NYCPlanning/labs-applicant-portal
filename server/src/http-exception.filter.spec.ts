import { unfoldedStackTrace } from './http-exception.filter';

describe('HttpExceptionFilter', () => {
  it('should unfold recursively nested response objects', () => {
    const mockResponse = {
      code: 1,
      title: '1 title',
      detail: '1 detail',
      response: {
        code: 2,
        title: '2 title',
        detail: '2 detail',
        response: {
          code: 3,
          title: '3 title',
          detail: '3 detail',
        },
      },
    };

    expect(unfoldedStackTrace(mockResponse, 400)).toEqual([
      {
        code: 1,
        title: '1 title',
        detail: '1 detail',
        meta: {},
        status: 400,
      },
      {
        code: 2,
        title: '2 title',
        detail: '2 detail',
        meta: {},
        status: 400,
      },
      {
        code: 3,
        title: '3 title',
        detail: '3 detail',
        meta: {},
        status: 400,
      },
    ]);
  });
});
