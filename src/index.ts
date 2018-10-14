import bodyParser from 'body-parser';
import cors from 'cors';
import express, { Request } from 'express';
import logger from 'morgan';
import { serverIo } from './serverio/ServerIO';

const passport = require('passport');

import { databaseIo, dbUseSsl } from './database/DatabaseIO';
import { playerApi } from './player/PlayerApi';
import { Player } from './types';
import { initPassport } from './authentication/PassportConfig'

import session from 'express-session'

// https://entwickler.de/online/javascript/passport-579800408.html
// authentication initialisieren
initPassport(process.env.username || 'admin', process.env.password || 'secret');

const isAuthenticated = (req: Request, res: any, next: any) => {
    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect('/login');

};

const STRATEGY : string = 'local';

const app = express();
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(cors());
app.use(session({
    secret: 'MyVoiceIsMyPassportVerifyMe',
    resave: false,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());


const router = express.Router();



app.route('/api/players')
    .get(isAuthenticated, async (_, res: any) => {
        try {
            const players: Player[] = await playerApi.findAll();
            serverIo.sendResponse(res, players);
        } catch (err) {
            console.error(err);
            res.send('Error ' + err);
        }
    })
    .post(async (_: any, res: any) => {
        serverIo.sendResponse(res);
    });

app.route('/api/public/players')
    .get( async (_, res: any) => {
        try {
            const players: Player[] = await playerApi.findAll();
            serverIo.sendResponse(res, players);
        } catch (err) {
            console.error(err);
            res.send('Error ' + err);
        }
    })

app.route('/api/player/:id')
    .get(isAuthenticated, async (request: Request, res: any) => {
        try {
            const id: number = request.params.id;
            const player: Player = await playerApi.findOne(id);
            serverIo.sendResponse(res, player);
        } catch (err) {
            console.error(err);
            serverIo.sendError(res, 404, err);
        }
    })
    .post(async (request: any, res: any) => {
        try {
            const id: number = request.params.id;
            const player2update: Player = request.body;
            const player: Player = await playerApi.update(id, player2update);
            serverIo.sendResponse(res, player);
        } catch (err) {
            console.error(err);
            serverIo.sendError(res, 404, err);
        }
    });

app.get('/db', isAuthenticated, async (_, res) => {
    try {
        const result = await databaseIo.query('SELECT * FROM player order by name desc');
        serverIo.sendResponse(res, result.rows);
    } catch (err) {
        console.error(err);
        serverIo.sendError(res, 500, err);
    }
});

app.get(
    '/secret', isAuthenticated, (req, res) => {
        console.log('secret function mit User:' + req.query.username);
        res.send('Hello Authenticated User: ' + req.query.username);
    });



app.post('/login', passport.authenticate(STRATEGY,
    {successRedirect: '/db', failureRedirect: '/uups'}));

app.route('/uups')
    .all((_, res: any) => {
        serverIo.sendError(res, 500, 'uups');
    });

app.post(
    '/forbidden', async(_, res) => {
        serverIo.sendError(res, 403, 'login to see my content');
    }
);

app.get('/logout', (req: Request, res: any) => {
    req.logout();
    res.redirect('/');
});

app.use('/', router);

app.listen(process.env.PORT || 8080, () => {
    // tslint:disable-next-line:no-console
    const port: string = process.env.PORT || '8080';
    const dbUrl: string = process.env.DATABASE_URL || 'n/a';
    if (process.env.DATABASE_LOCAL) {
        console.log(`connect to db with ${dbUrl} and ssl = ${dbUseSsl}`);
    }
    console.log(`Teams app listening on port ${port}!`);
});

