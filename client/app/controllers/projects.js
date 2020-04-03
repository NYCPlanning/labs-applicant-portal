import Controller from '@ember/controller';

export default class ProjectsController extends Controller {
    // project should only show up if 
    get toDoProjects () {
        // handle filtering here, reference in template
        // todo if statuscode is "Save" or "Package Preparation"
        this.model.filter(function(value) {
            console.log('value ', value)
            // if (!value.packages[0].statuscode) {
            //     console.log('packages do not exist on this object')
            // }
            // else {
            //     return value.packages[0].statuscode === "Active"
            // }
        })

        // just return all the projects
        return this.model
    }

    get planningProjects () {
        // "working on it" projects if statuscode is "Submitted", "Under Review", or "Revision Required"
        console.log("planningProjects getter")
    }
}
