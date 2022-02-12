import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { useRouter } from 'next/router'
import { type } from 'os'
import React from 'react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { object, string, TypeOf } from 'zod'

const registerSchema = object({
    name: string().nonempty('Name is required!'),
    password: string().nonempty('Password is required!').min(8, 'You need a minimum of 8 characters!'),
    email: string().nonempty('Email is required!').email('This email is not valid!'),
    requiredConfirmation: string().nonempty('Repeat Password is required!')
}).refine(data => data.password === data.requiredConfirmation, {
    path: ['requiredConfirmation'],
    message: 'The passwords don\'t match'
})

type registerType = TypeOf<typeof registerSchema>;

const Register = () => {
    
    const router = useRouter();
    const {register, formState:{errors}, handleSubmit} = useForm<registerType>({resolver:zodResolver(registerSchema)});
    const [registerError, setRegisterError] = useState();
    const onSubmit1 = async(values: registerType) => {
        try{
            const {data} = await axios.post(`${process.env.NEXT_PUBLIC_SERVER}/api/v1/user`, values);
            router.push('/auth/Login');
        }catch(e:any){
            setRegisterError(e.message);
        }
    }

  return (
    <>
        <form onSubmit={handleSubmit(onSubmit1)}>
            <p>{registerError}</p>
            <div className='form-element'>
                <label htmlFor="name">Name</label>
                <input type="text" placeholder='Please Fill in your name...' id='name' {...register('name')}/>
                <p>{errors.name?.message}</p>
            </div>
            <div className='form-element'>
                <label htmlFor="email">Email</label>
                <input type="text" placeholder='Please Fill in your email...' id='email' {...register('email')}/>
                <p>{errors.email?.message}</p>
            </div>
            <div className='form-element'>
                <label htmlFor="password">Password</label>
                <input type="password" placeholder='Please type in your password...' id='password' {...register('password')}/>
                <p>{errors.password?.message}</p>
            </div>
            <div className='form-element'>
                <label htmlFor="requiredConfirmation">Password Confirmation</label>
                <input type="password" placeholder='Please type in the same password again to confirm...' 
                id='requiredConfirmation' {...register('requiredConfirmation')}/>
                <p>{errors.requiredConfirmation?.message}</p>
            </div>
            <button type='submit'>Submit</button>
        </form>
    </>
  )
}

export default Register