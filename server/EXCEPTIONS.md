# Exception handling in our backend

## Quickstart example
```ts
// services/my-project.service.ts
public async getProject(){
  try {
    return myProject = this.get('dcp_project', ...);
  } catch (e) {
    const error = {
      code: 'NO_PROJECT_FOR_ID',
      title: 'No project for id',
      detail: `Failed to find a project for given id. ${e.message}`,
    };
    console.log(error); // for backend log records
    throw new HttpException(error, HttpStatus.NOT_FOUND);
  }
}
```
## Quickstart
To generate errors in the backend that will be passed to the
frontend, throw a [Nest-defined HttpException](https://docs.nestjs.com/exception-filters#throwing-standard-exceptions), <u>_generally within a service_</u>:

```js
  throw new HttpException(responseBody, status)
```

Where...
  - `status` is one of `HttpStatus` enum codes. E.g. `HttpStatus.UNAUTHORIZED`
  - `responseBody` argument is an object with the following schema. All three responseBody properties below
  conform to the [JSONAPI spec for error objects](https://jsonapi.org/format/#errors-processing). Visit the spec for more info and examples on each property.
    ```js
       const responseBody = {
        code: 'OUT_OF_CAFFEINE',
        title: 'Insufficient caffiene',
        detail: 'Applicant Portal could not fi nd coffee in Grand Central.',
      }
    ```
    - The `code` property is developer-defined, and should be a concise,
    app-identifier for the general type of error.
    - The `title` property is a short, human-readable sentence
    generally describing the error.
    - The `detail` property is a longer and more specific description of the
    error, providing context as necessary.

To scope the error to a specific part of the code, use try-catch blocks. Fo
r example,
the following try-catch scopes the thrown error to an attempt to find a project.

```ts
// services/my-project.service.ts
public async getProject(){
  try {
    return myProject = this.get('dcp_project', ...);
  } catch (e) {
    throw new HttpException({
      code: 'NO_PROJECT_FOR_ID',
      detail: `Failed to find a project for given id. ${e.message}`,
    }, HttpStatus.NOT_FOUND);
  }
}
```

The `catch` block in a try-catch will catch uncaught errors generated from the `try` block, 

Generally, when generating errors as described above, <u>*do so within Nest services*</u>.<br>
Services are usually quite close to the actual CRM requests and contain
specific backend business logic. We can provide better error details if we
try to scope try-catch to more specifc areas of business logic.

Lastly, we want to log out the `responseBody` argument so that our backend logs
will have a record of thrown exceptions from each layer in the stack trace:

```ts
} catch (e) {
  const error = {
    code: 'NO_PROJECT_FOR_ID',
    detail: `Failed to find a project for given id. ${e.message}`,
  };
  console.log(error);
  throw new HttpException(error, HttpStatus.NOT_FOUND);
}
```

## Relaying Errors

In the controller that consumes a service, _relay_ the error from the service by catching and re-throwing the error as it bubbles up:

```ts
// controllers/my-project.controller.ts
@Get('/')
async getProject(@Session() session) {
  try {
    return await this.myProjectService.getProject();
  } catch (e) {
    throw e; // re-throw the caught error to pass it along
  }
}
```

Note how it is not necessary to construct a new HttpException in the controller to relay the error from the service. Instead, we simply use `throw` to pass along the error `e` from the service.

The `catch` block in a try-catch will catch uncaught errors generated *within* functions that are called in the `try` block. Errors not yet caught will *bubble* through the function call stack until caught.

<u>Ultimately, we are relaying errors up to the Nest global HttpException filter.</u> By re-throwing or generating a new error in catch blocks, we keep the error in an "uncaught" state. The global filter catches any uncaught errors and standardizes how they are wrapped in a request before being sent to the frontend (more in a following section). If any try-catch catches an error but did not relay it or generate a new error, the filter would never detect an uncaught exception.

Controllers are usually the last handoff in the "relay" of errors.
(It may be possible that errors occur in Nest Guards or Interceptors sitting
between the controller and filter?)

## Relaying Errors from Async functions

In the controller example above, we intentionally `await` while
returning the value from an async function on the service.
```ts
try {
  return await this.myProjectService.getProject();
}
```

This is necessary to prevent the error from the async `getProject()` function
from being returned as an "unhandled rejected promise" and consequently bypassing the controller `catch` block. Since
`getProject()` is async, it will always return a promise. And because it errored,
it will be treated as a rejected promise instead of an HttpException that the controller `catch` block recognizes.

See [this article](https://itnext.io/error-handling-with-async-await-in-js-26c3f20bc06a) for a great explanation!

## General Errors / Preventing Gaps
Since we are trying to `throw new HttpException` at the service level, we may
want to write a generic, controller-level catch-all for errors. This will help catch
any uncaught errors from our services. Services are where we house the bulk
of our business logic for processing requests, so they have a large surface
area over which an error may not yet be covered by (occur outside of) a
try-catch.

```ts
// controllers/my-project.controller.ts
@Get('/')
async getProject(@Session() session) {
  try {
    return await this.myProjectService.getProject();
  } catch (e) {
    // Relay error if it is generated by service
    if (e instanceof HttpException) {
      throw e;
    } else {
      // A catch-all, providing a general error
      throw new HttpException({
        code: 'GET_PROJECT_FAILED',
        title: 'An unknown server error occured while getting projects',
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
```

## HTTP Exception Filter

Our nest backend has a custom [Nest exception filter](https://docs.nestjs.com/exception-filters#throwing-standard-exceptions) in place to catch all uncaught HttpExceptions and formats them to JSONAPI specifications before relaying them to the frontend. It will wrap the errors inside an `errors` array in an object:

```json
  {
    errors: [{
      code: 'OUT_OF_CAFFEINE',
      title: 'Insufficient caffiene',
      detail: 'Applicant Portal could not fi nd coffee in Grand Central.',
    }],
  }
```

This means in our code we don't need to manually wrap the error (we can just confidently throw errors, as illustrated in the examples above). Below is what manually wrapping the error would look like, but our HttpException does this for us:

```js
// controllers/my-project.controller.ts
@Get('/')
async getProject(@Session() session) {
  try {
    ...
  } catch (e) {
    if (e instanceof HttpException) {
      res.status(401).send({ errors: [e] });
    } else {
      console.log(e);

      res.status(500).send({ errors: [e] });
    };
}
```

The custom HTTP Exception filter helps format the error response so that the frontend
can easily ingest and display the errors.

## Talking to the frontend

Our frontend has an adapter that automatically picks up and
attaches errors from the backend to frontend models. We have also
written error pages to automatically display the errors, so long
as the incoming errors conform to the format below -- achieved by
following the example for generating errors in the Quickstart section. 

```json
{
  errors: [
    {
      code: 'OUT_OF_CAFFEINE',
      title: 'Insufficient caffiene',
      detail: 'Applicant Portal could not find coffee in Grand Central.',
      status: [401|500|etc...],
    }
  ]
}
```

The errors will then be accessible in the frontend via
`@model.errors` in `*-errors` routes.
