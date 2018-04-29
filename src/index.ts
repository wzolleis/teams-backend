import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import logger from "morgan";
import {serverIo} from "./serverio/ServerIO";

const app = express();

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(cors());

const router = express.Router();

// initDatabase();

app.route("/api/players")
    .get((_, res: any) => {
        const players: any[] = [
            {
                id: 1,
                name: "Roland",
                skills: {
                    speed: "90",
                    technik: "70",
                    condition: "100",
                    typ: "läufer"
                }
            }
        ];
        serverIo.sendResponse(res, players);

    })
    .post((_: any, res: any) => {

        serverIo.sendResponse(res);
    });

app.use("/", router);

app.listen(process.env.PORT || 8080, () => {
    // tslint:disable-next-line:no-console
    console.log("Teams app listening on port 8080!");
});
