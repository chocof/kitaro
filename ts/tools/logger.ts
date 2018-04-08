const winston = require("winston");

if (!process.env.ACCESS_LOG || !process.env.ERROR_LOG){
	throw new Error("[-]You have to define log files in .env file");
}
export const logger = new (winston.Logger)({
	transports: [
	new (winston.transports.Console)({timestamp: true}),
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
