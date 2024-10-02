import {ValidationUtils} from "../../utils/validation-utils.js";
import {UrlUtils} from "../../utils/url-utils.js";
import {OrdersService} from "../../services/orders-service.js";
import {FreelancersService} from "../../services/freelancers-service.js";

export class OrdersEdit {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        const id = UrlUtils.getUrlParam('id');
        if (!id) {
            this.openNewRoute('/');
        }

        document.getElementById('updateButton').addEventListener('click', this.updateOrder.bind(this));

        this.findElements();

        this.validations = [
            {element: this.amountInputElement},
            {element: this.descriptionInputElement},
        ];

        this.init(id).then();
    }

    findElements() {
        this.amountInputElement = document.getElementById('amountInput');
        this.descriptionInputElement = document.getElementById('descriptionInput');
        this.statusSelectElement = document.getElementById('statusSelect');
        this.freelancerSelectElement = document.getElementById('freelancerSelect');
    }

    async init(id) {
        const orderData = await this.getOrder(id);
        if (orderData) {
            this.showOrder(orderData);
            if (orderData.freelancer) {
                await this.getFreelancers(orderData.freelancer.id);
            }
        }
    }

    async getOrder(id) {
        const response = await OrdersService.getOrder(id);
        if (response.error) {
            console.log(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }
        this.originalData = response.order;
        return response.order;
    }

    showOrder(order) {
        // console.log(order);
        const breadcrumbsElement = document.getElementById('bread-order');
        breadcrumbsElement.href = '/orders/view?id=' + order.id;
        breadcrumbsElement.innerText = '№ ' + order.number;

        this.amountInputElement.value = order.amount;
        this.descriptionInputElement.value = order.description;
        for (let i = 0; i < this.statusSelectElement.options.length; i++) {
            if (this.statusSelectElement.options[i].value === order.status) {
                this.statusSelectElement.selectedIndex = i;
            }
        }

        this.showCalendars(order);
    }

    async getFreelancers(currentFreelancerId) {
        const response = await FreelancersService.getFreelancers();
        if (response.error) {
            console.log(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }
        // console.log(response.freelancers);
        for (let i = 0; i < response.freelancers.length; i++) {
            const option = document.createElement("option");
            option.value = response.freelancers[i].id;
            option.innerText = response.freelancers[i].name + ' ' + response.freelancers[i].lastName;
            if (currentFreelancerId === response.freelancers[i].id) {
                option.selected = true;
            }
            this.freelancerSelectElement.appendChild(option);
        }

        $(this.freelancerSelectElement).select2({
            theme: 'bootstrap4',
        });

        $(this.statusSelectElement).select2({
            theme: 'bootstrap4',
        });
    }

    showCalendars(order) {
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
        };

        const calendarScheduled = $('#calendar-scheduledDate');
        calendarScheduled.datetimepicker(Object.assign({}, calendarOptions, {date: order.scheduledDate}));
        calendarScheduled.on("change.datetimepicker", (e) => {
            this.scheduledDate = e.date;
            // console.log(this.scheduledDate);
        });

        this.deadlineDate = null;
        const calendarDeadline = $('#calendar-deadlineDate');
        calendarDeadline.datetimepicker(Object.assign({}, calendarOptions, {date: order.deadlineDate}));
        calendarDeadline.on("change.datetimepicker", (e) => {
            this.deadlineDate = e.date;
        });

        const calendarCompleted = $('#calendar-completeDate');
        calendarCompleted.datetimepicker(Object.assign({}, calendarOptions, {
            buttons: {
                showClear: true,
            },
            date: order.completeDate
        }));
        calendarCompleted.on("change.datetimepicker", (e) => {
            if (e.date) {
                this.completeDate = e.date;
            } else if (this.originalData.completeDate) {
                this.completeDate = false;
            } else {
                this.completeDate = null;
            }
        });
    }

    async updateOrder(e) {
        e.preventDefault();

        if (ValidationUtils.validateForm(this.validations)) {
            console.log('VALID');

            const changedData = {};
            if (parseInt(this.amountInputElement.value) !== parseInt(this.originalData.amount)) {
                changedData.amount = parseInt(this.amountInputElement.value);
            }
            if (this.descriptionInputElement.value !== this.originalData.description) {
                changedData.description = this.descriptionInputElement.value;
            }
            if (this.statusSelectElement.value !== this.originalData.status) {
                changedData.status = this.statusSelectElement.value;
            }
            if (this.freelancerSelectElement.value !== this.originalData.freelancer.id) {
                changedData.freelancer = this.freelancerSelectElement.value;
            }
            if (this.scheduledDate) {
                changedData.scheduledDate = this.scheduledDate.toISOString();
            }
            if (this.deadlineDate) {
                changedData.deadlineDate = this.deadlineDate.toISOString();
            }
            if (this.completeDate || this.completeDate === false) {
                changedData.completeDate = this.completeDate ? this.completeDate.toISOString() : null;
            }

            if (Object.keys(changedData).length > 0) {
                const response = await OrdersService.editOrder(this.originalData.id, changedData);
                if (response.error) {
                    console.log(response.error);
                    return response.redirect ? this.openNewRoute(response.redirect) : null;
                }
                return this.openNewRoute('/orders/view?id=' + this.originalData.id);
            }
        }
    }
}