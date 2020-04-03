import Route from '@ember/routing/route';

// model of this route is all projects
// will have associated controller, which will handle business logic of sorting project
// objects into appropriate buckets
export default class ProjectsRoute extends Route {
    // where we define the model of this part of the application
    model() {
        return [
            {
                id: "P2020M7890",
                name: "Huge New Public Library",
                primaryApplicant: "Brandyn Friedly",
                packages: [
                    {
                        type: 'pas',
                        statuscode: 'Saved'
                    }
                ]
            },
            {
                id: "P2020M7891",
                name: "Bagel Factory",
                primaryApplicant: "Godfrey Yeung",
                packages: [
                    {
                        type: 'pas',
                        statuscode: 'Package Preparation'
                    }
                ]
            },
            {
                id: "P2020M7890",
                name: "123 Ember Avenue",
                primaryApplicant: "Matt Gardner",
                packages: [
                    {
                        type: 'pas',
                        statuscode: 'Submitted'
                    }
                ]
            },
            {
                id: "P2020M7891",
                name: "Arizona Sun Dog Kennel",
                primaryApplicant: "Taylor McGinnis",
                packages: [
                    {
                        type: 'pas',
                        statuscode: 'Under Review'
                    }
                ]
            },
            {
                id: "P2020M7890",
                name: "All Things Blue For You Merch",
                primaryApplicant: "Hannah Kates",
                packages: [
                    {
                        type: 'pas',
                        statuscode: 'Revision Required'
                    }
                ]
            },
            {
                id: "P2020M7891",
                name: "Pop Up Palm Tree & Goat Farm",
                primaryApplicant: "Nneka Sobers",
                packages: []
            },
        ]
    }
}
