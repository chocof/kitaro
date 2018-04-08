require('dotenv').load();
import {logger} from "./tools";
const io = require("socket.io")();

const PORT = process.env.PORT || 8080;
logger.info(`Started server on port ${PORT}`);
io.listen(PORT);
