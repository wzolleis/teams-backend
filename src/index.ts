import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import logger from "morgan";
import {serverIo} from "./serverio/ServerIO";

import { Pool } from 'pg'

const app = express();

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(cors());

const router = express.Router();

// ssl wenn wir auf Heroku gestartet werden, kein ssl wenn die db lokal angebunden ist
const dbUseSsl: boolean = !process.env.DATABASE_LOCAL;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: dbUseSsl
});


// initDatabase();

app.route("/api/players")
    .get((_, res: any) => {
        const players: any[] = [
            {
                id: 1,
                name: "Roland",
                typ: "Läufer",
                overall: 80,
                skills: {
                    speed: "90",
                    technik: "70",
                    condition: "100"
                }
            },
            {
                id: 2,
                name: "Albert",
                typ: "Kämpfer",
                overall: 70,
                skills: {
                    speed: "70",
                    technik: "70",
                    condition: "70",
                }
            }

        ];
        serverIo.sendResponse(res, players);

    })
    .post((_: any, res: any) => {

        serverIo.sendResponse(res);
    });

app.get('/db', async (_, res) => {
    try {
        const client = await pool.connect()
        const result = await client.query('SELECT * FROM player');
        serverIo.sendResponse(res, result.rows);
        client.release();
    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    }
});

app.use("/", router);

app.listen(process.env.PORT || 8080, () => {
    // tslint:disable-next-line:no-console
    const port: string = process.env.PORT || "8080";
    const dbUrl: string = process.env.DATABASE_URL || 'n/a';
    console.log(`connect to db with ${dbUrl} and ssl = ${dbUseSsl}`);
    console.log(`Teams app listening on port ${port}!`);
});
