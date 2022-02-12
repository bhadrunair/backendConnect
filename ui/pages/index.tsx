import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import useSWR from 'swr'
import styles from '../styles/Home.module.css'
import fetcher from '../utils/fetcher'

interface LocalUser{
  name: string, 
  email: string,
  createdAt: string,
  updatedAt: string,
  iat: string,
  exp: string,
  __v: number,
  _id: string
}

const Home: NextPage<{fallbackData: LocalUser}> = ({fallbackData}) => {
  
  const {data} = useSWR<LocalUser|null>(`${process.env.NEXT_PUBLIC_SERVER}/api/v1/user`, fetcher, {fallbackData});
  
  return (
    <>
      {data?<p>Welcome {data.name}</p>:<p>Please Login <Link href='/auth/Login'>here</Link> to access this link.</p>}
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async(context) => {
  const data = await fetcher(`${process.env.NEXT_PUBLIC_SERVER}/api/v1/user`, context.req.headers);
  return{
    props:{
      fallbackData: data
    }
  }
}

export default Home
