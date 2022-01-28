import { omit } from "lodash";
import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import { string } from "zod";
import UserModel, { UserType } from "../model/user.model"

export const createUser = async(input: UserType) => {
    try{const user = await UserModel.create(input);
        if(user){
            return omit(user.toJSON(), 'password');
        }
    }catch(e:any){
        throw new Error(e);
    }
    
}

export const updateUser = async(query: FilterQuery<UserType>, update: UpdateQuery<UserType>, 
    options?: QueryOptions) => {
    try{
        const user = await UserModel.findOneAndUpdate(query, update, {new: true});
        return omit(user.toJSON(), 'password');
    }catch(e:any){
        throw new Error(e);
}

}

export const verifyPassword = async({email, password}: {email: string, password: string}) => {
    try{
        const user = await UserModel.findOne({email: email});
        if(!user) return false;
        const isValid = await user.comparePassword(password);
        if(!isValid) return false;
        return omit(user.toJSON(), 'password');
    }catch(e:any){
        throw new Error(e);
    }
}

export const findUser = async(query: FilterQuery<UserType>) => {
    return await UserModel.findOne(query).lean();
}