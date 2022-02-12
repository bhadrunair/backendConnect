import { Request, Response } from "express";
import { UserDocument, UserType } from "../model/user.model";
import { createUser } from "../service/user.service";

const createUserHandler = async(req: Request<{}, {}, UserDocument>, res: Response) => {
    try{
        const user = await createUser(req.body);
        res.status(200).send(user);
    }catch(e:any){
        res.status(400).send(`An error ${e} occurred.`);
    }
}

export const getUserHandler = (req: Request, res: Response) => {
    res.send(res.locals.user);
}

export default createUserHandler;