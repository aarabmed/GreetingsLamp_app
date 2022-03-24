import React from "react"
import {isAuthenticated} from "common/isAuthenticated";


const Index = ()=> {
  return <></>;
}



export const getServerSideProps = async (ctx) => {
    const isAuth =  await isAuthenticated()
    return {
        redirect: {
          permanent: false,
          destination: isAuth?'/admin/dashboard':'/admin/login',
        },
    }
}

export default Index

