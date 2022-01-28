import mongoose, { mongo } from "mongoose";
import { UserDocument } from "./user.model";


export interface ProductType{
    title: string,
    user: UserDocument['_id'],
    description: string,
    price: number,
    image: string
}

export interface ProductDocument extends ProductType, mongoose.Document{
    createdAt: Date,
    updatedAt: Date
}

const productSchema = new mongoose.Schema({
    title: {type: String},
    description: {type: String},
    price: {type: Number},
    image: {type: String},
    user: {type: mongoose.Types.ObjectId, ref: 'User'},
});

const ProductModel = mongoose.model<ProductDocument>('Product', productSchema);

export default ProductModel;