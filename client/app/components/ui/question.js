import Component from '@glimmer/component';
import { guidFor } from '@ember/object/internals';

export default class QuestionComponent extends Component {
  questionId = `question-${guidFor(this)}`;
}
