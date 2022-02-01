import serverApp from "../utils/server";
import {MongoMemoryServer} from 'mongodb-memory-server'
import mongoose, { mongo } from 'mongoose'
import supertest from 'supertest'
import * as ProductService from '../service/product.service'
import { signJwt } from "../utils/jwt.utils";
import { createProduct } from "../service/product.service";

const app = serverApp();

const userId = new mongoose.Types.ObjectId().toString();

const productId = new mongoose.Types.ObjectId().toString();

const userPayload = {
    _id: userId,
    name: 'Mungerilal',
    email: 'mungerilal@gmail.com'
}

const createProductPayload = {
    title: 'Mungerilal ke haseen sapne',
    description: 'Sapne suhane hote hain',
    price: 450,
    image: 'img.jpeg'
}

const productPayload = {
    user: userId,
    title: 'Mungerilal ke haseen sapne',
    description: 'Sapne suhane hote hain',
    price: 450,
    image: 'img.jpeg'
}

describe('Product', () => {
    beforeAll(async() => {
        const mongoServer = await MongoMemoryServer.create();
        await mongoose.connect(mongoServer.getUri());
    })
    afterAll(async() => {
        await mongoose.disconnect();
        await mongoose.connection.close();
    })
    describe('Create Product', () => {
        describe('If user isn\'t logged in', () => {
            it('Return status 403', async() => {
                const {statusCode} = await supertest(app)
                .post('/api/v1/product')
                .send(createProductPayload);

                expect(statusCode).toBe(403);
            })
        })
        describe('If user is logged in', () => {
            it('Return status 200 and return the product', async() => {
                const jwt = signJwt(userPayload);

                const {statusCode, body} = await supertest(app)
                .post('/api/v1/product')
                .set('Authorization', `Bearer ${jwt}`)
                .set('x-refresh', `${jwt}`)
                .send(createProductPayload);

                expect(statusCode).toBe(200);

                expect(body).toStrictEqual({
                    ...createProductPayload, 
                    __v: 0,
                    user: userId,
                    _id: expect.any(String),
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String)
                })
            })
        })
    })
    describe('Get Product', () => {
        describe('If product doesn\'t exist', () => {
            it('Return a 404 status code', async() => {
                const productfail = 'product123'
                const {statusCode} = await supertest(app)
                .get(`/api/v1/product/${productfail}`);

                expect(statusCode).toBe(404);
            })
        })
        describe('If product exist', () => {
            it('Return a 200 status code and return product', async() => {
                const product = await createProduct(productPayload);
                
                const {statusCode, body} = await supertest(app)
                .get(`/api/v1/product/${product._id}`);

                expect(statusCode).toBe(200);

                expect(body).toStrictEqual({
                    ...createProductPayload,
                    user: String(product.user),
                    _id: String(product._id),
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                    __v: 0
                })
            })
        })
    })
})