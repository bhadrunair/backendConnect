import { object, string } from "zod";

const sessionSchema = object({
    body: object({
        email: string({
            required_error: 'Email is required.'
        }).email('Email needs to be valid!'),
        password: string({
            required_error: 'Password is required.'
        })
    })
})

export default sessionSchema;