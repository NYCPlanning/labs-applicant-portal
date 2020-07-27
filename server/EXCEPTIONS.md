# Exception handling in our backend

## Quickstart

To generate errors in the backend that will be passed to the
frontend, throw a [Nest-defined HttpException](https://docs.nestjs.com/exception-filters#throwing-standard-exceptions), <u>_generally within a service_</u>:

```js
  throw new HttpException(responseBody, status)
```

Where...
  - `status` is one of `HttpStatus` enum codes. E.g. `HttpStatus.UNAUTHORIZED`
  - `responseBody` argument is an object with the following schema.
    ```js
       const responseBody = {
        code: 'APPLICANT_PORTAL_ERROR_CODE',
        message: 'Applicant Portal could not find coffee. CRM: CRM ran out of tea.',
      }
    ```
    - The `code` property is developer-defined, and should be a unique, concise,
    descriptive identifier for the type of error. Users can provide this code to
    help developers locate the code that yielded the error.
    - The `message` property is a short, human-readable sentence firstly
    describing the error for the benefit of end users. Secondly, it should contain
    errors relayed from CRM, if available.

To scope the error to a specific part of the code, use try-catch blocks. For example,
the following try-catch scopes the thrown error to an attempt to find a project.

```js
// services/my-project.service.ts
getProject(){
  try {
    return myProject = this.get('dcp_project', ...);
  } catch (e) {
    throw new HttpException({
      code: 'GET_PROJECTS',
      message: `Failed to find a project for given id. CRM: ${e}`,
    });
  }
}
```

Generally, when generating errors as described above, <u>*do so within Nest services*</u>.

## Relaying Errors

In the controller that consumes a service, _relay_ the error from the service by simply throwing the error as it bubbles up:

```js
// controllers/my-project.controller.ts
@Get('/')
  async getProject(@Session() session) {
    try {
      return this.myProjectService.getProject();
    } catch (e) {
      throw e; // simply relay the bubbling error
    }
  }
}
```

Note how it is not necessary to construct a new HttpException in the controller to relay the error from the service. Instead, we simply use `throw` to pass along the error `e` from the service.

Errors will *bubble* through the function call stack. The `catch` block in a try-catch will also catch errors generated from *within* functions that are called in the `try` block.

Only the HttpException caught and thrown closest to or on the controller
endpoint will be returned for a given request. To prevent confusion over which
backend layer should provide the most detailed error handling, this document prescribes generating new HTTPExceptions in services, and simply relaying them in controllers.

## General Errors / Preventing Gaps
Since we are trying to `throw new HttpException` at the service level, we may
want to write a generic, controller-level catch-all for errors. This will help catch
any uncaught errors from our services. Services are where we house the bulk
of our business logic for processing requests, so they have a large surface
area over which an error may not yet be covered by (occur outside of) a
try-catch.

```js
// controllers/my-project.controller.ts
@Get('/')
async getProject(@Session() session) {
  try {
    return this.myProjectService.getProject();
  } catch (e) {
    if (e instanceof HttpException) {
      throw e;
    else {
      // A catch-all, providing a general error
      throw new HttpException({
        code: 'GET_PROJECT_UNKNOWN',
        message: 'An unknown server error occured while getting projects',
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
```

## HTTP Exception Filter

Our nest backend has a custom [Nest exception filter](https://docs.nestjs.com/exception-filters#throwing-standard-exceptions) in place to catch all thrown HttpExceptions and format them before relaying them to the frontend. It will wrap the errors inside an `errors` array in an object:

```json
  {
    errors: [ ...thrownHttpExceptions]
  }
```

This means in our code we don't need to manually wrap the error. Below is what manually wrapping the error would look like, but our HttpException does this for us:

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
    response: {
      message: "our error message", 
      code: OUR_ERROR_CODE, // We also determine this value
    },
    status: [401|500|etc...],
    message: "our error message"
  ]
}
```

The errors will then be accessible in the frontend via
`@model.errors` in `*-errors` routes.

## More about the HttpException error format (optional reading)

The `response` property takes the form (string or object) of whatever is passed in to the first ("response") argument of the HTTPException constructor. For applicant portal, we prescribe always passing an object to the "response" constructor argument for consistency. This also allows us to add our own "error code" within the response obejct.

The `status` property is derived from the status code passed in to the second ("status")  argument of the HTTPException constructor.

The top-level `message` is either
  - a) A copy of the `response` property, if that property is a simple string.
  - b) The value of the "message" property within `response`, if the value of `response` is an object.
    - Since we do prescribe assigning an object to `response`, we also prescribe adding a "message" property to that object (otherwise, the top-level `message` will be display a generic "HTTP Exception" string).
  - c) Derived from the "status" argument, if `response` is an object without the `message` property.

 In general, we've written the frontend to discard use of the `error.message` property, and instead use its identical source,  `error.response.message`.