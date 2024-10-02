import config from "../../config/config.js";
import {CommonUtils} from "../../utils/common-utils.js";
import {FreelancersService} from "../../services/freelancers-service";

export class FreelancersList {

    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.getFreelancers().then();
    }

    async getFreelancers() {
        const response = await FreelancersService.getFreelancers();
        if (response.error) {
            console.log(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }
        this.showRecords(response.freelancers);
    }

    showRecords(freelancers) {
        console.log(freelancers);
        const recordsElement = document.getElementById('records');
        for (let i = 0; i < freelancers.length; i++) {
            const trElement = document.createElement('tr');
            trElement.insertCell().innerText = i + 1;
            trElement.insertCell().innerHTML = freelancers[i].avatar ? '<img class="freelancer-avatar" src="' + config.host + freelancers[i].avatar + '" alt="Фото">' : '';
            trElement.insertCell().innerText = freelancers[i].name + ' ' + freelancers[i].lastName;
            trElement.insertCell().innerText = freelancers[i].email;
            trElement.insertCell().innerHTML = CommonUtils.getLevelHtml(freelancers[i].level);
            trElement.insertCell().innerText = freelancers[i].education;
            trElement.insertCell().innerText = freelancers[i].location;
            trElement.insertCell().innerText = freelancers[i].skills;
            trElement.insertCell().innerHTML = CommonUtils.generateToolsColumn('freelancers', freelancers[i].id);
            recordsElement.appendChild(trElement);
        }

        new DataTable('#data-table', {
            language: {
                "lengthMenu": "Показывать _MENU_ записей на странице",
                "search": "Фильтр:",
                "info": "Страница _PAGE_ из _PAGES_",
                "paginate": {
                    "next": "Вперед",
                    "previous": "Назад",
                },
            },
        });
    }
}