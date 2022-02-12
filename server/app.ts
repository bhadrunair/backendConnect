import config from 'config';
import log from './utils/logger';
import connectDB from './utils/connectDB';
import serverApp from './utils/server';

const app = serverApp();

const port = config.get<number>('port');

const start = async() => {

    await connectDB();

    app.listen(port, () => {

        log.info(`Server is listening to port: ${port}...`);
        
    })

}

start();



