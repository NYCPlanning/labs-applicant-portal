import { authenticateSession } from 'ember-simple-auth';

export default function(server) {
  /*
    Seed your development database using your factories.
    This data will not be loaded in your tests.
  */

  server.create('contact');
  server.createList('project', 3, 'toDo');
  server.createList('project', 5, 'done');
}
