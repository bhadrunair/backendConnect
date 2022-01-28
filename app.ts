import express from 'express';
import config from 'config';
import log from './utils/logger';
import routes from './routes';
import connectDB from './utils/connectDB';
import deserializeUser from './middleware/deserializeUser';

const app = express();

app.use(express.json());

app.use(deserializeUser);

const port = config.get<number>('port');

const start = async() => {

    await connectDB();

    app.listen(port, () => {

        log.info(`Server is listening to port: ${port}...`);
        
    })

}

start();

routes(app);

