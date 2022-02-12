import { notDeepEqual } from 'assert';
import mongoose from 'mongoose'
import supertest from 'supertest';
import * as UserService from '../service/user.service'
import serverApp from '../utils/server';
import * as SessionService from '../service/session.service'

const app = serverApp();

const userId = new mongoose.Types.ObjectId().toString();

const userPayload = {
    _id: userId,
    name: 'Marley',
    email: 'marley@gmail.com',
    __v: 0,
    createdAt: 'This is a good date',
    updatedAt: 'This is a bad date'
}

const createUserPayload = {
    name: 'Marley',
    email: 'marley@gmail.com',
    password: 'doucheBag',
    requiredConfirmation: 'doucheBag'
}

const badUserPayload = {
    name: 'Marley',
    email: 'marley@gmail.com',
    password: 'doucheBag',
    requiredConfirmation: 'UUglyBoi'
}

const sessionPayload = {
    user: userPayload._id,
    valid: true,
    userAgent: 'Alright it is chrome',
    _id: 'This is a fake id',
    __v: 0,
    createdAt: 'This is a real date',
    updatedAt: 'Chal be'
}

const createSessionPayload = {
    email: 'marley@gmail.com',
    password: 'doucheBag',
    userAgent: 'Alright it is chrome'
}

describe('User', () => {
    describe('User Create', () => {
        describe('If username, email and password are valid', () => {
            it('Status Code 200, return the user and mock should be called with payload', async() => {
                const mockCreateUserService = jest.spyOn(UserService, 'createUser')
                //@ts-ignore
                .mockReturnValueOnce(userPayload);

                const {statusCode, body} = await supertest(app)
                .post('/api/v1/user').send(createUserPayload);

                expect(statusCode).toBe(200);

                expect(body).toStrictEqual({
                    ...userPayload,
                })

                expect(mockCreateUserService).toBeCalledWith(createUserPayload);
            })
        })
        describe('If password and reconfirmation password don\'t match', () => {
            it('Status Code 400 and mock should not run', async() => {
                const mockCreateUserService = jest.spyOn(UserService, 'createUser')
                //@ts-ignore
                .mockReturnValueOnce(userPayload);

                const {statusCode} = await supertest(app)
                .post('/api/v1/user').send(badUserPayload);

                expect(statusCode).toBe(400);

                expect(mockCreateUserService).not.toBeCalledWith(badUserPayload);
            })
        })
        describe('If service throws an error', () => {
            it('Status Code 400 and mock should run with payload', async() => {
                const mockCreateUserService = jest.spyOn(UserService, 'createUser')
                //@ts-ignore
                .mockRejectedValueOnce(userPayload);

                const {statusCode} = await supertest(app)
                .post('/api/v1/user').send(createUserPayload);

                expect(statusCode).toBe(400);

                expect(mockCreateUserService).toBeCalledWith(createUserPayload);
            })
        })
    })
})

describe('Session', () => {
    describe('Create Session', () => {
        describe('If email and password are valid', () => {
            it('Return status code 200 and send access and refresh Tokens', async() => {
                const mockCreateSession = jest.spyOn(SessionService, 'createSession')
                //@ts-ignore
                .mockReturnValueOnce(sessionPayload);
                
                const mockFindUser = jest.spyOn(UserService, 'findUser')
                //@ts-ignore
                .mockReturnValueOnce(userPayload);

                const {statusCode, body} = await supertest(app)
                .post('/api/v1/session')
                .send(createSessionPayload);

                expect(statusCode).toBe(200);

                expect(body).toStrictEqual({
                    accessToken: expect.any(String),
                    refreshToken: expect.any(String)
                })
            })
        })
    })
})