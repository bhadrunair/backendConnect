import config from 'config';
import mongoose from 'mongoose';
import log from './logger'

const connectDB = async() => {
    
    const mongo_url = config.get<string>('mongo_url');

    try{
        await mongoose.connect(mongo_url);
        log.info('MongoDB has successfully connected.')
    }catch(e: any){
        log.error(`You\'re shit outta luck bruv! ${e}`)
    }
}

export default connectDB;