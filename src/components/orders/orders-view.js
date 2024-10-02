import config from "../../config/config.js";
import {CommonUtils} from "../../utils/common-utils.js";
import {UrlUtils} from "../../utils/url-utils.js";
import {OrdersService} from "../../services/orders-service";

export class OrdersView {

    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        const id = UrlUtils.getUrlParam('id');
        if (!id) {
            this.openNewRoute('/');
        }
        this.getOrder(id).then();
    }

    async getOrder(id) {
        const response = await OrdersService.getOrder(id);
        if (response.error) {
            console.log(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }
        this.showOrder(response.order);
    }

    showOrder(order) {
        console.log(order);

        const statusInfo = CommonUtils.getStatusInfo(order.status);
        document.getElementById('status-name').innerText = statusInfo.name;
        document.getElementById('status-bg').classList.add('bg-' + statusInfo.color);
        document.getElementById('status-icon').classList.add('fa-' + statusInfo.icon);

        if (order.freelancer.avatar) {
            document.getElementById('freelancer-avatar').src = config.host + order.freelancer.avatar;
        }
        document.getElementById('freelancer-name').innerHTML =
            '<a href="/freelancers/view?id=' + order.freelancer.id + '">' + order.freelancer.name + ' ' + order.freelancer.lastName + '</a>';

        document.getElementById('scheduledDate').innerText = (new Date(order.scheduledDate)).toLocaleDateString('ru-RU');
        document.getElementById('deadlineDate').innerText = (new Date(order.deadlineDate)).toLocaleDateString('ru-RU');
        document.getElementById('completeDate').innerText = (order.completeDate) ? (new Date(order.completeDate)).toLocaleDateString('ru-RU') : '...';

        document.getElementById('number').innerText = order.number;
        document.getElementById('description').innerText = order.description;
        document.getElementById('owner').innerText = order.owner.name + ' ' + order.owner.lastName;
        document.getElementById('amount').innerText = (order.amount).toLocaleString('ru-RU');
        document.getElementById('created').innerText = (new Date(order.createdAt)).toLocaleString('ru-RU');

        document.getElementById('edit-link').href = '/orders/edit?id=' + order.id;
        document.getElementById('delete-link').href = '/orders/delete?id=' + order.id;
    }
}