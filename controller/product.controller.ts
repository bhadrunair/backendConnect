import { Request, Response } from "express";
import { ProductDocument, ProductType } from "../model/product.model";
import { createProduct, deleteProduct, getProduct, updateProduct } from "../service/product.service";
import { findUser } from "../service/user.service";
import log from "../utils/logger";

export interface ProductInput{
    title: string,
    description: string,
    price: number,
    image: string
}

export const createProductHandler = async(req: Request<{}, {}, ProductInput>, res: Response) => {
    try{
        const userId = res.locals.user._id as string;
        const product = await createProduct({...req.body, user: userId});
        res.send(product);
    }catch(e:any){
        res.status(403).send(`An error ${e} occurred in createProductHandler.`)
    }
}

interface ParamsInput{
    productId: string
}

export const getProductHandler = async(req: Request<ParamsInput>, res: Response) => {
    try{
        const product = await getProduct({_id: req.params.productId});
        res.send(product);
    }catch(e:any){
        res.status(404).send(`An error ${e} occurred in getProductHandler.`)
    }
}

export const updateProductHandler = async(req: Request<ParamsInput, {}, ProductDocument>, res: Response) => {
    try{
        const product = await getProduct({_id: req.params.productId});
        log.info(product);
        if(!product) res.send('Couldn\'t find product');
        const user = res.locals.user;
        if(product){
            log.info(`The res.locals.user is ${String(user._id)} and product.user is ${String(product.user)}.`)
            if(String(user._id) === String(product.user)){
                const newProduct = await updateProduct({_id: req.params.productId}, req.body, {new: true});
                res.send(newProduct);
            }else{
                res.status(401).send('You are not authorized to take this action.');
            }
        }

    }catch(e:any){
        res.status(400).send(`An error ${e} occurred in updateProductHandler.`)
    }
}

export const deleteProductHandler = async(req: Request<ParamsInput>, res: Response) => {
    try{
        const product = await getProduct({_id: req.params.productId});
        if(!product) res.send('Couldn\'t find product');
        const user = res.locals.user;
        if(product){
            if(String(user._id) === String(product.user)){
                const newProduct = await deleteProduct({_id: req.params.productId});
                res.send('Product has been successfully deleted.');
            }else{
                res.status(401).send('You are not authorized to take this action.');
            }
        }
    }catch(e:any){
        res.status(400).send(`An error ${e} occurred in createProductHandler.`)
    }
}