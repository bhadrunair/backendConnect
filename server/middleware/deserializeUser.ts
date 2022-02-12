import { Request, Response, NextFunction, CookieOptions } from "express";
import { get } from "lodash";
import { verifyJwt } from "../utils/jwt.utils";
import { reIssueAccessToken } from "../service/session.service";
import config from "config";
import log from "../utils/logger";

const deserializeUser = async (req: Request, res: Response, next: NextFunction) => {

    const accessToken = get(req, 'headers.authorization', '').replace(/Bearer\s/, '') || get(req.cookies, 'accessToken');
    const refreshToken = get(req, 'headers.x-refresh') || get(req.cookies, 'refreshToken');
    log.info(accessToken);
    log.info(refreshToken);

    if(!accessToken) return next();

    const {decoded, expired} = verifyJwt(accessToken);

    if(decoded){
        res.locals.user = decoded;
        return next();
    }

    if(expired && refreshToken){
        const newAccessToken = await reIssueAccessToken(accessToken);
        if(newAccessToken){
            //res.setHeader('x-access-token', newAccessToken);
            const newAccessTokenCookieOptions : CookieOptions = {
                maxAge: 900000,
                domain: config.get<string>('domain'),
                httpOnly: true,
                sameSite: 'strict',
                secure: config.get<boolean>('secure'),
                path: '/'
            }
            res.cookie('accessToken', newAccessToken, newAccessTokenCookieOptions);
            const {decoded} = verifyJwt(newAccessToken);
            res.locals.user = decoded;
            return next();
        }
    }

    return next();
}

export default deserializeUser;