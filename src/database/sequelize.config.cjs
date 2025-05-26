require('dotenv/config');

if (!process.env.SSL_CERT && process.env.SSL_CERT_B64) {
    const decoded = Buffer.from(process.env.SSL_CERT_B64, 'base64').toString('utf-8');
    process.env.SSL_CERT = decoded;
}

const isDev = process.env.NODE_ENV === 'development';
const isStaging = process.env.NODE_ENV === 'staging';

const databaseUrl = process.env.DATABASE_URL;
const shouldUseSsl = process.env.SSL_CERT || (databaseUrl && databaseUrl.includes('ssl=true'));

const config = {
    dialect: 'postgres',
    url: databaseUrl,
    define: {
        timestamps: true,
        freezeTableName: true,
    },
    logQueryParameters: true,
    logging: isDev || isStaging,
    ...(shouldUseSsl && {
        dialectOptions: {
            ssl: {
                require: true,
                ...(process.env.SSL_CERT ? { ca: process.env.SSL_CERT } : { rejectUnauthorized: false }),
            },
        },
    }),
};

module.exports = {
    development: {
        ...config,
    },
    test: {
        ...config,
    },
    staging: {
        ...config,
    },
    production: {
        ...config,
    },
};
