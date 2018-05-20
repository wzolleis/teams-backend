import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import logger from "morgan";
import { serverIo } from "./serverio/ServerIO";

import { Player } from './types'
import { playerApi } from './player/PlayerApi'
import { databaseIo, dbUseSsl } from './database/DatabaseIO'

const app = express();

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(cors());

const router = express.Router();



app.route("/api/players")
    .get( async (_, res: any) => {
        try {
            const players: Player[] = await playerApi.findAll();
            serverIo.sendResponse(res, players);
        } catch (err) {
            console.error(err);
            res.send("Error " + err);
        }
    })
    .post( async (_: any, res: any) => {
        serverIo.sendResponse(res);
    });

app.get('/db', async (_, res) => {
    try {
        const result = await databaseIo.query('SELECT * FROM player order by name desc');
        serverIo.sendResponse(res, result.rows);
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
    if (process.env.DATABASE_LOCAL) {
        console.log(`connect to db with ${dbUrl} and ssl = ${dbUseSsl}`);
    }
    console.log(`Teams app listening on port ${port}!`);
});
