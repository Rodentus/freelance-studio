import config from "../config/config.js";
import {OrdersService} from "../services/orders-service.js";

export class Dashboard {
    constructor(openNewRoute) {
        console.log('DASHBOARD');
        this.openNewRoute = openNewRoute;
        this.getOrders().then();
    }

    async getOrders() {
        const response = await OrdersService.getOrders();
        if (response.error) {
            console.log(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }
        this.loadOrdersInfo(response.orders);
        this.loadCalendarInfo(response.orders);
    }

    loadOrdersInfo(orders) {
        document.getElementById('total-orders').innerText = orders.length;
        document.getElementById('done-orders').innerText = orders.filter(order => order.status === config.orderStatuses.success).length;
        // document.getElementById('in-progress-orders').innerText = orders.filter(order => order.status === config.orderStatuses.new || order.status === config.orderStatuses.confirmed).length;
        document.getElementById('in-progress-orders').innerText = orders.filter(order => [config.orderStatuses.new, config.orderStatuses.confirmed].includes(order.status)).length;
        document.getElementById('canceled-orders').innerText = orders.filter(order => order.status === config.orderStatuses.canceled).length;
    }

    loadCalendarInfo(orders) {
        const preparedEvents = [];

        for (let i = 0; i < orders.length; i++) {
            let color = null;
            if (orders[i].status === config.orderStatuses.success) {
                color = '#C0C0C0';
            }

            if (orders[i].scheduledDate) {
                preparedEvents.push({
                    title: orders[i].freelancer.name + ' ' + orders[i].freelancer.lastName + ' выполняет заказ № ' + orders[i].number,
                    // start: new Date(scheduledDate.getFullYear(), scheduledDate.getMonth(), scheduledDate.getDate()),
                    start: new Date(orders[i].scheduledDate),
                    backgroundColor: color ? color : '#00c0ef',
                    borderColor: color ? color : '#00c0ef',
                    allDay: true,
                });
            }

            if (orders[i].deadlineDate) {
                preparedEvents.push({
                    title: 'Дедлайн заказа № ' + orders[i].number,
                    start: new Date(orders[i].deadlineDate),
                    backgroundColor: color ? color : '#f39c12',
                    borderColor: color ? color : '#f39c12',
                    allDay: true,
                });
            }

            if (orders[i].completeDate) {
                preparedEvents.push({
                    title: 'Заказ № ' + orders[i].number + ' выполнен фрилансером ' + orders[i].freelancer.name,
                    start: new Date(orders[i].completeDate),
                    backgroundColor: '#00a65a',
                    borderColor: '#00a65a',
                    allDay: true,
                });
            }
        }

        (new FullCalendar.Calendar(document.getElementById('calendar'), {
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: ''
            },
            themeSystem: 'bootstrap',
            firstDay: 1,
            locale: 'ru',
            events: preparedEvents,
        })).render();
    }
}