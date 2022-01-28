import { AnyZodObject } from "zod";
import { NextFunction, Request, Response } from "express";
import log from "../utils/logger";

const validateResources = (schema: AnyZodObject) => (req: Request, res: Response, 
    next: NextFunction) => {
    try{
        schema.parse({
            body: req.body,
            params: req.params,
            query: req.query
        });
        return next();
    }catch(e: any){
        log.error(`Validate Resource failed with error: ${e}`);
        return res.status(400).send(`Validate Resource failed with error: ${e}`);
    }
}

export default validateResources;