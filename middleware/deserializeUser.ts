import { Request, Response, NextFunction } from "express";
import { get } from "lodash";
import { verifyJwt } from "../utils/jwt.utils";

const deserializeUser = (req: Request, res: Response, next: NextFunction) => {

    const accessToken = get(req, 'headers.authorization', '').replace(/Bearer\s/, '');
    const refreshToken = get(req, 'headers.x-refresh');

    if(!accessToken) return next();

    const {decoded, expired} = verifyJwt(refreshToken);

    if(decoded){
        res.locals.user = decoded;
        return next();
    }

    // if(expired && refreshToken){
    //     const newAccessToken = reIssueAccessToken(refreshToken);
    //     if(newAccessToken){
    //         res.setHeader('x-access-token', newAccessToken);
    //         const {decoded} = verifyJwt(newAccessToken);
    //         res.locals.user = decoded;
    //         return next();
    //     }
    // }

    return next();
}

export default deserializeUser;