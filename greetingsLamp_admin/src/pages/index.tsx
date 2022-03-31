import React, {useState,useContext,useEffect} from "react"


const Index = ()=> {
  return <></>;
}



export const getServerSideProps = async (ctx) => {
 
    return {
        redirect: {
          permanent: false,
          destination: '/admin/dashboard',
        },
    }
}

export default Index

