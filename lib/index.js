"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').load();
const tools_1 = require("./tools");
const io = require("socket.io")();
const PORT = process.env.PORT || 8080;
tools_1.logger.info(`Started server on port ${PORT}`);
io.listen(PORT);
//# sourceMappingURL=index.js.map