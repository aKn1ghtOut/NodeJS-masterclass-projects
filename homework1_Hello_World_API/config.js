//Environment variables to distinguish between development, staging and production variable values

var environments = {};

environments.staging = {
    "httpPort" : 3000,
    //"httpsPort" : 3001,
    'envName' : 'staging'
};

environments.production = {
    "httpPort" : 5000,
    //"httpsPort" : 5001,
    'envName' : "production"
};

var curr_env = typeof(process.env.NODE_ENV) == "string" ? process.env.NODE_ENV.toLowerCase() : "";

var envExport = typeof(environments[curr_env]) == 'object' ? environments[curr_env] : environments.staging;

module.exports = envExport;