import jwt from 'jsonwebtoken';
import config from 'config';

const privateKey = config.get<string>('privateKey');
const publicKey = config.get<string>('publicKey');

export const signJwt = (object: Object, options?: jwt.SignOptions | undefined) => {
    return jwt.sign(object, privateKey, {...(options && options), algorithm: 'RS256'});
}

export const verifyJwt = (token: string) => {

    try{
        const decoded = jwt.verify(token, publicKey);
        return{
            decoded,
            valid: true,
            expired: false

        }
    }catch(e:any){
        return{
            decoded: null,
            valid: false,
            expired: e.message === 'jwt expired'
        }
    }
}

