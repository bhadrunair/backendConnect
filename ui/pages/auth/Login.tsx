import { useRouter } from 'next/router'
import React from 'react'
import { useForm } from 'react-hook-form';
import { object, string, TypeOf } from 'zod';
import {zodResolver} from '@hookform/resolvers/zod'
import { useState } from 'react';
import axios from 'axios';

const loginSchema = object({
        email: string().nonempty('Email is required.').email('Email needs to be valid!'),
        password: string().nonempty('Password is required.')
})

type loginType = TypeOf<typeof loginSchema>;

const Login = () => {
  
    const {register, formState: {errors}, handleSubmit} = useForm<loginType>({resolver: zodResolver(loginSchema)})
    const router = useRouter();
    const [registerError, setRegisterError] = useState();
    const onSubmit1 = async(values: loginType) => {
        try{
            const {data} = await axios.post(`${process.env.NEXT_PUBLIC_SERVER}/api/v1/session`, values,
            {withCredentials: true});
            router.push('/');
        }catch(e:any){
            setRegisterError(e.message);
        }
    }

  return (
    <>
        <form onSubmit={handleSubmit(onSubmit1)}>
            <p>{registerError}</p>
            <div className='form-element'>
                <label htmlFor='email'>Email</label>
                <input id='email' placeholder='Please fill in your email...' type='text' {...register('email')}/>
                <p>{errors.email?.message}</p>
            </div>
            <div className='form-element'>
                <label htmlFor='password'>Password</label>
                <input id='password' placeholder='Please fill in your password...' type='password' {...register('password')}/>
                <p>{errors.password?.message}</p>
            </div>
            <button type='submit'>Submit</button>
        </form>

    </>
  )
}

export default Login