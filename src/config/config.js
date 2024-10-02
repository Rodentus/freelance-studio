const host = process.env.HOST;

const config = {
    host: host,
    api: host + '/api',
    freelancerLevels: {
        junior: 'junior',
        middle: 'middle',
        senior: 'senior',
    },
    orderStatuses: {
        confirmed: 'confirmed',
        new: 'new',
        success: 'success',
        canceled: 'canceled',
    }
};

export default config;