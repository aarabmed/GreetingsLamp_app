import React, {useState,useEffect} from "react"

import { useRouter } from "next/router";

import dynamic from 'next/dynamic';
import PrivatLayout from "components/layouts/PrivateLayout";

import Spinner from "components/spin/spiner"
import {isAuthenticated} from "common/isAuthenticated";
 


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





export const getServerSideProps = async (ctx) => {
  const isAuth = await isAuthenticated()

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
}

export default Index

