import {UrlUtils} from "../../utils/url-utils.js";
import {FreelancersService} from "../../services/freelancers-service.js";

export class FreelancersDelete {

    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        const id = UrlUtils.getUrlParam('id');
        if (!id) {
            this.openNewRoute('/');
        }

        this.deleteFreelancer(id).then();
    }

    async deleteFreelancer(id) {
        const response = await FreelancersService.deleteFreelancer(id);
        if (response.error) {
            console.log(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }
        return this.openNewRoute('/freelancers');
    }
}