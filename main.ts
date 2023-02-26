import app from "./service";
import config from './service.config'

const { port } = config

app.listen(port);
