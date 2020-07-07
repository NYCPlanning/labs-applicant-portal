import Component from '@glimmer/component';
import { task } from 'ember-concurrency';

// isSubmit, isEnabled, onClick
// onClick can be a promise/task — it's wrapped in a task
// see ember-concurrency docs for more on the API about clickTask
export default class SaveButtonComponent extends Component {
  // enabledness depends on some upstream context
  // we want the consumer to determine enabledness
  // used directly on the save button for enabledness
  get isEnabled() {
    return this.args.isEnabled && !this.clickTask.isRunning;
  }

  // depends on whether the task has run and was successful
  get didSave() {
    return !this.isEnabled && this.clickTask.lastSuccessful;
  }

  // Allows for a curried function to be invoked and passed
  // the public onClick callback:
  // <SaveButton
  //   @wrapperCallback={{fn this.callback someArg}} {{! called first}}
  //   @onClick={{this.clickHandler}}  {{! passed to wrapperCallback}}
  // />
  // Necessary here because consuming component might need to control
  // sequencing of public and private events
  get wrapperCallback() {
    return this.args.wrapperCallback || ((callback) => callback());
  }

  // triggered when the button is clicked
  @task(function* () {
    yield this.wrapperCallback(this.args.onClick);
  }).withTestWaiter()
  clickTask;
}
