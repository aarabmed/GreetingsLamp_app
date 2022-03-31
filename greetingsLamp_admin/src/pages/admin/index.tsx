import React from "react"
import {isAuthenticated} from "common/isAuthenticated";


const Index = ()=> {
  return <></>;
}



export const getServerSideProps = async ({req}) => {
    const isAuth =  await isAuthenticated(req.session.get('userSession'))
    return {
        redirect: {
          permanent: false,
          destination: isAuth?'/admin/dashboard':'/admin/login',
        },
    }
}

export default Index

