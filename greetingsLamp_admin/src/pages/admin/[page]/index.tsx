import React, {useState,useEffect} from "react"

import { useRouter } from "next/router";

import dynamic from 'next/dynamic';
import PrivatLayout from "components/layouts/PrivateLayout";

import Spinner from "components/spin/spiner"
import {isAuthenticated} from "common/isAuthenticated";
import { withIronSession } from "next-iron-session";
 


const AdminLayout = dynamic(
  import('components/layouts/adminLayout')
);




const Index = ()=> {
  const router = useRouter();
  const [loading, setLoading] = useState(true)

  
  const{query} = router
  useEffect(()=>{
    if(loading){
      setLoading(false)
    }
    
  },[loading])

  
  
  if(loading) return <div className='indexSpinner'><Spinner/></div>
  const title  = query.page.toString();
  
  return (
    <PrivatLayout  title={`${title.charAt(0).toUpperCase() + title.slice(1)} page | Greetings Lamp`}>
          <AdminLayout
            pageType={query.page.toString()}
            subPage={''}
          />
    </PrivatLayout>     
  );
}



export const getServerSideProps = withIronSession(async ({req}) => {
  const isAuth = await isAuthenticated(req.session.get('userSession'))

  if(!isAuth){
    return {
        redirect: {
          permanent: false,
          destination: '/admin/login',
        },
    }
  }
  return {
    props: {},
  };
},{
  cookieName: "userSession",
  password: process.env.USER_SESSION,
  ttl:60*60,
  cookieOptions: {
      secure: false,
      httpOnly: true,
      sameSite: "lax",
  }
})

export default Index

