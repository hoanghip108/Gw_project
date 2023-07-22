const {
    createLogger,
    format,
    transports,
    addColors
} = require('winston');
const { join } = require('path');
const fs = require('fs');
const util = require('util');
const config = require('../config');

require('winston-daily-rotate-file');

const {
    combine,
    timestamp,
    colorize,
    printf,
    errors,
    json
} = format;
const SPLAT = Symbol.for('splat');

const directory = config.log_directory || 'logs';
const filename = config.log_file_name || `${config.name}.${config.env}`;

const myCustomLevels = {
    levels: {
        error: 0,
        warn: 1,
        info: 2,
        http: 3,
        verbose: 4,
        debug: 5,
        silly: 6
    },
    colors: {
        error: 'red',
        warn: 'yellow',
        info: 'green',
        http: 'grey',
        verbose: 'cyan',
        debug: 'blue',
        silly: 'magenta'
    }
};

// Create the log directory if it does not exist
if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
}

const consoleFormatMessage = format((info) => {
    if (info.stack) {
        info.message = util.format(info.message, '\n', info.stack);
    } else if (info[SPLAT]) {
        info.message = util.format(info.message, ...info[SPLAT]);
    }

    return info;
});

const fileFormatMessage = (opts) => {
    return format((info) => {
        if (!opts || !opts.levels || (opts.levels.indexOf(info.level) > -1)) {
            if (info[SPLAT] && !info.stack) {
                info.message = util.format(info.message, ...info[SPLAT]);
            }
        }

        return info;
    })();
};

const myFormat = printf((info) => {
    if (typeof info.message === 'object') {
        info.message = JSON.stringify(info.message, null, 3);
    }

    return `${info.timestamp} ${info.level}: ${info.message || ''}`;
});

const upperLevel = format((info) => {
    info.level = info.level.toUpperCase().padEnd(7, ' ');
    return info;
});

const logger = createLogger({
    levels: myCustomLevels.levels,
    level: config.log_level || process.env.NODE_ENV === 'development' ? 'debug' : 'info',
    timestamp: true,
    format: combine(
        errors({ stack: true }),
        timestamp()
    ),
    transports: [
        new transports.Console({
            format: combine(
                upperLevel(),
                consoleFormatMessage(),
                colorize({
                    all: true
                }),
                // colorize(),
                myFormat
            )
        }),
        new transports.DailyRotateFile({
            filename: join(directory, `${filename}-%DATE%.log`),
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '90d',
            format: combine(
                fileFormatMessage(),
                json()
            )
        })
    ]
});

addColors(myCustomLevels.colors);

logger.stream = {
    write: (message) => {
        logger.http(message.trim());
    }
};

module.exports = logger;
