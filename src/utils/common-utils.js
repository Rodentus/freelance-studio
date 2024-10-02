import config from "../config/config.js";

export class CommonUtils {

    static getLevelHtml(level) {
        let levelHtml = null;
        switch (level) {
            case config.freelancerLevels.junior:
                levelHtml = '<span class="badge badge-info">Junior</span>';
                break;
            case config.freelancerLevels.middle:
                levelHtml = '<span class="badge badge-warning">Middle</span>';
                break;
            case config.freelancerLevels.senior:
                levelHtml = '<span class="badge badge-success">Senior</span>';
                break;
            default:
                levelHtml = '<span class="badge badge-secondary">Unknown</span>';
        }
        return levelHtml;
    }

    static getStatusInfo(status) {
        const statusInfo = {
            name: '',
            color: '',
            icon: ''
        };
        switch (status) {
            case config.orderStatuses.confirmed:
                statusInfo.name = 'Подтвержден';
                statusInfo.color = 'info';
                statusInfo.icon = 'eye';
                break;
            case config.orderStatuses.new:
                statusInfo.name = 'Новый';
                statusInfo.color = 'secondary';
                statusInfo.icon = 'star';
                break;
            case config.orderStatuses.success:
                statusInfo.name = 'Выполнен';
                statusInfo.color = 'success';
                statusInfo.icon = 'check';
                break;
            case config.orderStatuses.canceled:
                statusInfo.name = 'Отменен';
                statusInfo.color = 'danger';
                statusInfo.icon = 'times';
                break;
            default:
                statusInfo.name = 'Unknown';
                statusInfo.color = 'warning';
                statusInfo.icon = 'eye';
        }
        return statusInfo;
    }

    static generateToolsColumn(entity, id) {
        return '<div class="' + entity + '-tools">' +
            '<a href="/' + entity + '/view?id=' + id + '" class="fas fa-eye"></a>' +
            '<a href="/' + entity + '/edit?id=' + id + '" class="fas fa-edit"></a>' +
            '<a href="/' + entity + '/delete?id=' + id + '" class="fas fa-trash"></a>' +
            '</div>';
    }
}