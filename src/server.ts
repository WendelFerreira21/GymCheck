import { env } from "process";
import { app } from "./app.js";


app.listen({
    host:'0.0.0.0',
    port: env.PORT ? Number(env.PORT) : 3333,
}).then(() => {
    console.log('HTTP server running')
})