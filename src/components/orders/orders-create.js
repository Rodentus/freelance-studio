import {ValidationUtils} from "../../utils/validation-utils.js";
import {OrdersService} from "../../services/orders-service";
import {FreelancersService} from "../../services/freelancers-service";

export class OrdersCreate {

    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        this.findElements();
        this.getFreelancers().then();
        this.showCalendars();

        document.getElementById('saveButton').addEventListener('click', this.saveOrder.bind(this));
    }

    findElements() {
        this.amountInputElement = document.getElementById('amountInput');
        this.descriptionInputElement = document.getElementById('descriptionInput');
        this.statusSelectElement = document.getElementById('statusSelect');
        this.freelancerSelectElement = document.getElementById('freelancerSelect');
        this.scheduledCardElement = document.getElementById('scheduled-card');
        this.deadlineCardElement = document.getElementById('deadline-card');
    }

    async getFreelancers() {

        const response = await FreelancersService.getFreelancers();
        if (response.error) {
            console.log(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }

        for (let i = 0; i < response.freelancers.length; i++) {
            const option = document.createElement("option");
            option.value = response.freelancers[i].id;
            option.innerText = response.freelancers[i].name + ' ' + response.freelancers[i].lastName;
            this.freelancerSelectElement.appendChild(option);
        }

        $(this.freelancerSelectElement).select2({
            theme: 'bootstrap4',
        });

        $(this.statusSelectElement).select2({
            theme: 'bootstrap4',
        });
    }

    showCalendars() {
        this.scheduledDate = null;
        this.completeDate = null;
        this.deadlineDate = null;

        const calendarOptions = {
            inline: true,
            locale: 'ru',
            startOfTheWeek: 1,
            icons: {
                time: 'far fa-clock',
                date: 'far fa-calendar-alt',
            },
            useCurrent: false,
        }

        const calendarScheduled = $('#calendar-scheduledDate');
        calendarScheduled.datetimepicker(calendarOptions);
        calendarScheduled.on("change.datetimepicker", (e) => {
            this.scheduledDate = e.date;
            console.log(this.scheduledDate);
        });

        const calendarDeadline = $('#calendar-deadlineDate');
        calendarDeadline.datetimepicker(calendarOptions);
        calendarDeadline.on("change.datetimepicker", (e) => {
            this.deadlineDate = e.date;
        });

        const calendarCompleted = $('#calendar-completeDate');
        calendarOptions.buttons = {
            showClear: true,
        };
        calendarCompleted.datetimepicker(calendarOptions);
        calendarCompleted.on("change.datetimepicker", (e) => {
            this.completeDate = e.date;
        });
    }

    async saveOrder(e) {
        e.preventDefault();

        this.validations = [
            {element: this.amountInputElement},
            {element: this.descriptionInputElement},
            {element: this.scheduledCardElement, options: {checkProperty: this.scheduledDate}},
            {element: this.deadlineCardElement, options: {checkProperty: this.deadlineDate}},
        ];

        if (ValidationUtils.validateForm(this.validations)) {
            console.log('VALID');

            const createData = {
                amount: parseInt(this.amountInputElement.value),
                description: this.descriptionInputElement.value,
                status: this.statusSelectElement.value,
                freelancer: this.freelancerSelectElement.value,
                deadlineDate: this.deadlineDate.toISOString(),
                scheduledDate: this.scheduledDate.toISOString(),
            };

            if (this.completeDate) {
                createData.completeDate = this.completeDate.toISOString();
            }

            const response = await OrdersService.createOrder(createData);
            if (response.error) {
                console.log(response.error);
                return response.redirect ? this.openNewRoute(response.redirect) : null;
            }
            return this.openNewRoute('/orders/view?id=' + response.id);
        }
    }
}