import Route from '@ember/routing/route';

// model of this route is all projects
// will have associated controller, which will handle business logic of sorting project
// objects into appropriate buckets
export default class ProjectsRoute extends Route {
  // where we define the model of this part of the application
  model() {
    return this.store.findAll('project');
  }
}
