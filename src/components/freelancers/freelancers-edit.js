import {FileUtils} from "../../utils/file-utils.js";
import config from "../../config/config.js";
import {CommonUtils} from "../../utils/common-utils.js";
import {ValidationUtils} from "../../utils/validation-utils.js";
import {UrlUtils} from "../../utils/url-utils.js";
import {FreelancersService} from "../../services/freelancers-service.js";

export class FreelancersEdit {

    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        const id = UrlUtils.getUrlParam('id');
        if (!id) {
            this.openNewRoute('/');
        }

        document.getElementById('updateButton').addEventListener('click', this.updateFreelancer.bind(this));
        bsCustomFileInput.init();

        this.findElements();

        this.validations = [
            {element: this.nameInputElement},
            {element: this.lastNameInputElement},
            {element: this.educationInputElement},
            {element: this.locationInputElement},
            {element: this.skillsInputElement},
            {element: this.infoInputElement},
            {element: this.emailInputElement, options: {pattern: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,6})+$/}},
        ];

        this.getFreelancer(id).then();
    }

    findElements() {
        this.nameInputElement = document.getElementById('nameInput');
        this.lastNameInputElement = document.getElementById('lastNameInput');
        this.emailInputElement = document.getElementById('emailInput');
        this.educationInputElement = document.getElementById('educationInput');
        this.locationInputElement = document.getElementById('locationInput');
        this.skillsInputElement = document.getElementById('skillsInput');
        this.infoInputElement = document.getElementById('infoInput');
        this.levelSelectElement = document.getElementById('levelSelect');
        this.avatarInputElement = document.getElementById('avatarInput');
    }

    async getFreelancer(id) {
        const response = await FreelancersService.getFreelancer(id);
        if (response.error) {
            console.log(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }
        this.originalData = response.freelancer;
        this.showFreelancer(response.freelancer);
    }

    showFreelancer(freelancer) {
        console.log(freelancer);

        const breadcrumbsElement = document.getElementById('bread-freelancer');
        breadcrumbsElement.href = '/freelancers/view?id=' + freelancer.id;
        breadcrumbsElement.innerText = freelancer.name + ' ' + freelancer.lastName;

        if (freelancer.avatar) {
            document.getElementById('avatar').src = config.host + freelancer.avatar;
        }
        document.getElementById('level').innerHTML = CommonUtils.getLevelHtml(freelancer.level);

        this.nameInputElement.value = freelancer.name;
        this.lastNameInputElement.value = freelancer.lastName;
        this.emailInputElement.value = freelancer.email;
        this.educationInputElement.value = freelancer.education;
        this.locationInputElement.value = freelancer.location;
        this.skillsInputElement.value = freelancer.skills;
        this.infoInputElement.value = freelancer.info;

        for (let i = 0; i < this.levelSelectElement.options.length; i++) {
            if (this.levelSelectElement.options[i].value === freelancer.level) {
                this.levelSelectElement.selectedIndex = i;
            }
        }
    }

    async updateFreelancer(e) {
        e.preventDefault();

        if (ValidationUtils.validateForm(this.validations)) {
            console.log('VALID');

            const changedData = {};

            let originalFieldArray = [
                this.originalData.name, this.originalData.lastName,
                this.originalData.education, this.originalData.location,
                this.originalData.skills, this.originalData.info,
                this.originalData.level
            ];
            let textInputArray = [
                this.nameInputElement, this.lastNameInputElement,
                this.educationInputElement, this.locationInputElement,
                this.skillsInputElement, this.infoInputElement,
                this.levelSelectElement
            ];
            let textArray = [
                'name', 'lastName', 'education', 'location', 'skills', 'info', 'level'
            ];

            for (let i = 0; i < textArray.length; i++) {
                if (textInputArray[i].value !== originalFieldArray[i]) {
                    changedData[textArray[i]] = textInputArray[i].value;
                }
            }

            if (this.avatarInputElement.files && this.avatarInputElement.files.length > 0) {
                changedData.avatarBase64 = await FileUtils.convertFileToBase64(this.avatarInputElement.files[0]);
            }

            if (Object.keys(changedData).length > 0) {
                const response = await FreelancersService.editFreelancer(this.originalData.id, changedData);
                if (response.error) {
                    console.log(response.error);
                    return response.redirect ? this.openNewRoute(response.redirect) : null;
                }
                return this.openNewRoute('/freelancers/view?id=' + this.originalData.id);
            }
        }
    }
}