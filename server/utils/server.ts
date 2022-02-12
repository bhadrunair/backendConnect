import express from 'express';
import deserializeUser from '../middleware/deserializeUser';
import routes from '../routes';
import cookieParser from 'cookie-parser'
import cors from 'cors';
import config from 'config';

const serverApp = () => {

    const app = express();

    app.use(express.json());

    app.use(cors({
        origin: config.get<string>("origin"),
        credentials: true
    }));

    app.use(cookieParser());

    app.use(deserializeUser);

    routes(app);

    return app;

}

export default serverApp;