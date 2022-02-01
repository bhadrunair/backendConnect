import express from 'express';
import deserializeUser from '../middleware/deserializeUser';
import routes from '../routes';

const serverApp = () => {

    const app = express();

    app.use(express.json());

    app.use(deserializeUser);

    routes(app);

    return app;

}

export default serverApp;