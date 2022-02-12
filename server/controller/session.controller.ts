import { CookieOptions, Request, Response } from "express";
import { createSession, findSession, updateSession } from "../service/session.service";
import { findUser, verifyPassword } from "../service/user.service";
import {get} from 'lodash'
import config from "config";
import { signJwt } from "../utils/jwt.utils";
import { strict } from "assert";

export const createSessionHandler = async(req: Request, res: Response) => {
    try{
        const {email, password} = req.body;
        const userAgent = get(req.headers, 'user-agent', '');
        const session = await createSession({email, password, userAgent});
        const user = await findUser({email: email});
        if(!user) res.send('Unable to find user.');
        if(session){
            const accessToken = signJwt({...user, session: session._id}, 
                {expiresIn: config.get<string>('accessTokenttl')});
            const refreshToken = signJwt({...user, session: session._id}, 
                {expiresIn: config.get<string>('refreshTokenttl')});
            const accessTokenCookieOptions : CookieOptions = {
                maxAge: 900000,
                httpOnly: true,
                sameSite: 'strict',
                domain: config.get<string>('domain'),
                secure: config.get<boolean>('secure'),
                path: '/'
            } 
            
            res.cookie('accessToken', accessToken, accessTokenCookieOptions);
            res.cookie('refreshToken', refreshToken, {...accessTokenCookieOptions, maxAge: 3.156E15});
            res.send();
        }
    }catch(e:any){
        res.status(400).send(`An error ${e} occurred in createSessionHandler.`)
    }
}

export const findSessionHandler = async(req: Request, res:Response) => {
    try{
        const user = res.locals.user;
        const session = await findSession({user: user._id});
        res.send(session);
    }catch(e:any){
        res.status(400).send(`An error ${e} occurred in findSessionHandler.`);
    }
}

export const updateSessionHandler = async(req: Request, res:Response) => {
    try{
        const user = res.locals.user;
        const session = await updateSession({user: user._id});
        res.send(session);
    }catch(e:any){
        res.status(400).send(`An error ${e} occurred in updateSessionHandler.`);
    }
}