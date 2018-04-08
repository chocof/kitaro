"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston = require("winston");
if (!process.env.ACCESS_LOG || !process.env.ERROR_LOG) {
    throw new Error("[-]You have to define log files in .env file");
}
exports.logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({ timestamp: true }),
        new (winston.transports.File)({
            name: 'info-file',
            filename: process.env.ACCESS_LOG,
            level: 'info'
        }),
        new (winston.transports.File)({
            name: 'error-file',
            filename: process.env.ERROR_LOG,
            level: 'error'
        })
    ]
});
//# sourceMappingURL=logger.js.map