import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import ProductModel, { ProductDocument, ProductType } from "../model/product.model";


export const createProduct = async(input: ProductType) => {
    try{
        const product = await ProductModel.create(input);
        return product.toJSON();
    }catch(e:any){
        throw new Error(e);
    }
}

export const getProduct = async(query: FilterQuery<ProductDocument>) => {
    try{
        const product = await ProductModel.findOne(query);
        if(product) return product.toJSON();
    }catch(e:any){
        throw new Error(e);
    }
}

export const updateProduct = async(query: FilterQuery<ProductDocument>, update: UpdateQuery<ProductDocument>, 
    options: QueryOptions) => {
    try{
        const product = await ProductModel.findOneAndUpdate(query, update, {new: true});
        if(product) return product.toJSON();
    }catch(e:any){
        throw new Error(e);
    }
}

export const deleteProduct = async(query: FilterQuery<ProductDocument>) => {
    try{
        await ProductModel.findOneAndDelete(query);
        return 'Product has been deleted'
    }catch(e:any){
        throw new Error(e);
    }
}