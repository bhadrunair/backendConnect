import { number, object, string } from "zod";

const productBodySchema = {
    body: object({
        title: string({
            required_error: 'Title is required.'
        }),
        price: number({
            required_error: 'Price is required.'
        }),
        image: string({
            required_error: 'Image is required.'
        }),
        description: string({
            required_error: 'Description is required.'
        }).max(1000, 'You are exceeding the allotted 1000 characters.')
    })
}

const productUpdateBodySchema = {
    body: object({
        title: string({
            required_error: 'Title is required.'
        }),
        price: number({
            required_error: 'Price is required.'
        }),
        image: string({
            required_error: 'Image is required.'
        }),
        description: string({
            required_error: 'Description is required.'
        }).max(1000, 'You are exceeding the allotted 1000 characters.')
    }).partial()
}

const productParamsSchema = {
    params: object({
        productId: string({
            required_error: 'You haven\'t put a productId'
        })
    })
}

export const productCreateSchema = object({
    ...productBodySchema
})

export const productGetSchema = object({
    ...productParamsSchema
})

export const productUpdateSchema = object({
    ...productParamsSchema, 
    ...productUpdateBodySchema
})

export const productDeleteSchema = object({
    ...productParamsSchema
})