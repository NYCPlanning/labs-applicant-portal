import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import SubmittableProjectsNewForm from '../../../validations/submittable-projects-new-form';


export default class ProjectsNewFormComponent extends Component {
  validations = {
    SubmittableProjectsNewForm,
  };

  @service
  router;

  @service
  store;

  // @tracked dcpProjectname

  // @tracked emailAddress1

  // get projectForm(){
  //   return {
  //   dcpProjectname: this.dcpProjectname
  // }
  // } 

  // get contactForm() {
  //   return {
  //     emailAddress1: this.emailAddress1
  //   }
  // }


  @action
  async submitPackage() {
    try {
      // this.args.package.pro
      
      const applicant = {
        firstname: "John",
        lastname: "Doe",
        emailaddress: "persona@fakedomain.com"
      }
      // const projectApplicants = await this.args.package.projectApplicants;
      // projectApplicants.push(applicant);
      // console.debug("project applicants", projectApplicants);
      const project = this.store.createRecord('project', {
        dcpProjectname: this.args.package.projectName
      })
      const projectApplicants = await project.projectApplicants
      // const projectApplicant = this.store.createRecord('project-applicant', {
      //   emailaddress: this.args.applicantEmail,
      //   project
      // })
      const emailAddress = this.args.package.contactEmail;
      // console.log("email address", emailAddress);
      const projectApplicant = await this.store.queryRecord('contact', {
        email: this.args.package.contactEmail
      })
      // console.debug('project name', this.args.package.projectName)
      console.debug('project', project)
      console.debug('project applicants', projectApplicants)
      projectApplicants.pushObject(projectApplicant)
      // await project.save(); 
      // await projectApplicant.save();

      // this.args.package.projectApplicants.push(applicant)
      // await this.args.package.submit();
    } catch (error) {
      console.log('Save new project package error:', error);
    }
  }
}
