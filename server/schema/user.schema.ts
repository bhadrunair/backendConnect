import { object, string } from "zod";

const userSchema = object({
    body: object({
        name: string({
            required_error: 'Name is required!'
        }),
        password: string({
            required_error: 'Password is required!'
        }).min(8, 'You need a minimum of 8 characters!'),
        email: string({
            required_error: 'Email is required!'
        }).email('This email is not valid!'),
        requiredConfirmation: string({
            required_error: 'Repeat Password is required!'
        })
    }).refine(data => data.password === data.requiredConfirmation, {
        path: ['requiredConfirmation'],
        message: 'The passwords don\'t match'
    })
})

export default userSchema;