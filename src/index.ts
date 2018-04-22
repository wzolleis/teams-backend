import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import logger from "morgan";
import { cleanerApi } from "./cleaner/cleaner_api";
import { initDatabase } from "./persistence/Persistence";
import { serverIo } from "./serverio/ServerIO";
import { ICleaner } from "./types";

const app = express();

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(cors());

const router = express.Router();

initDatabase();

app.route("/cc/api/cleaner")
    .get((_, res: any) => {
        const cleaners = cleanerApi.findAllCleaners();
        serverIo.sendResponse(res, cleaners);
    })
    // insert cleaner
    .post((req: any, res: any) => {
        const cleaner: ICleaner = req.body;
        cleanerApi.insertCleaner(cleaner);
        serverIo.sendResponse(res);
    });

/**
 * update cleaner
 */
app.route("/cc/api/cleaner/:id")
    .put((req: any, res: any) => {
        const cleaner: ICleaner = req.body;
        const id: number = Number.parseInt(req.params.id);
        if (id !== cleaner.id) {
            const msg = `die id in der url '${id}' stimmt nicht mit der id im body '${cleaner.id}' überein`;
            console.log(msg);
            serverIo.sendError(res, 400, msg);
            return;
        } else {
            cleanerApi.saveCleaner(cleaner);
            const data: object = {id};
            serverIo.sendResponse(res, data);
        }
    })
    .delete((req: any, res: any) => {
        const id: number = req.params.id;
        cleanerApi.deleteCleaner({id});
        serverIo.sendResponse(res);
    });

app.use("/", router);

app.listen(process.env.PORT || 8080, () => {
    // tslint:disable-next-line:no-console
    console.log("Coffe Cleaner app listening on port 8080!");
});
