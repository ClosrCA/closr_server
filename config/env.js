
const env = process.env.NODE_ENV || 'local';

const local = {
    app: {
        port: process.env.PORT || 10010
    },
    db: {
        host: 'mongodb://localhost:27017/closr'
    }
};

// todo: dev and staging env for future
const development = {};
const staging = {};

const prod = {
    app: {
        port: process.env.PORT || 10010
    },
    db: {
        host: 'mongodb://ec2-35-182-37-165.ca-central-1.compute.amazonaws.com/closr'
    }
};

const config = {
    local,
    development,
    staging,
    prod
};

module.exports = config[env];


