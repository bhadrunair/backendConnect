import { query } from "express";
import { FilterQuery } from "mongoose";
import config from "config";
import SessionModel, { SessionDocument } from "../model/session.model";
import { signJwt, verifyJwt } from "../utils/jwt.utils";
import { findUser, verifyPassword } from "./user.service";
import { get } from "lodash";
import log from "../utils/logger"


export const createSession = async({email, password, userAgent}: {email: string, password: string, 
userAgent: string}) => {
    try{
        const user = await findUser({email: email});
        if(!user) return false;
        const isValid = await verifyPassword({email, password});
        if(!isValid) return false;
        const session = await SessionModel.create({user, userAgent});
        if(!session) return false;
        return session.toJSON();
    }catch(e:any){
        throw new Error(e);
    }
    
}

export const findSession = async(query: FilterQuery<SessionDocument>) => {
    try{
        const session = await SessionModel.findOne(query);
        if(session){
            return session.toJSON();
        }
    }catch(e:any){
        throw new Error(e);
    }
}

export const updateSession = async(query: FilterQuery<SessionDocument>) => {
    try{
        const session = await SessionModel.findOne(query);
        if(!session) return false;
        const user = await findUser({_id: session.user});
        if(!user) return false;
        await SessionModel.findOneAndUpdate(query, {valid: false});
        const accessToken = null;
        const refreshToken = null;
        return {accessToken, refreshToken};
    }catch(e:any){
        throw new Error(e);
    }
}

export const reIssueAccessToken = async(token: string) => {
    try{
        const {decoded, valid} = verifyJwt(token);
        if(!decoded || !get(decoded, 'session')) return false;
        const session = await SessionModel.findOne(get(decoded, 'session'));
        if(!session || !session.valid) return false;
        const user = await findUser({_id: session.user});
        if(!user) return false;
        const accessToken = signJwt({...user, session: session._id}, 
            {expiresIn: config.get<string>('accessTokenttl')});
        return accessToken;
    }catch(e:any){
        throw new Error(e);
    }
}