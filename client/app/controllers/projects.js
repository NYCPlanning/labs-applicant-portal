import Controller from '@ember/controller';

export default class ProjectsController extends Controller {
    // projects for applicant to do
    get applicantProjects () {
        // handle filtering here, reference in template as this.applicantProjects
        // todo if statuscode is "Save" or "Package Preparation"
        return this.model.filter((project) => {
            console.log('project being filtered', project)
            // if (project.primaryApplicant === 'Brandyn Friedly') { return true}

            return project.packages.some((projectpackage) => {
                if (projectpackage.statuscode === 'Saved' || projectpackage.statuscode === 'Package Preparation') {
                    console.log("TRUEEE", project)
                    return true
                    } else { 
                        console.log('FAAALSE') 
                        return false
                    }
            })

        })
    }

    // projects for nyc planning to do
    get planningProjects () {
        // if statuscode is "Submitted", "Under Review", or "Revision Required"
        console.log("planningProjects getter")
        return this.model.filter((project) => {
            return project.packages.some((projectpackage) => {
                if (projectpackage.statuscode === 'Submitted' || projectpackage.statuscode === 'Under Review' || projectpackage.statuscode === "Revision Required") {
                    console.log("TRUEEE", project)
                    return true
                    } else { 
                        console.log('FAAALSE') 
                        return false
                    }
            })

        })
    }
}
