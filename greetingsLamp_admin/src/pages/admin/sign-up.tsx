
import React from 'react';

import {isAuthenticated} from "common/isAuthenticated";
import axios from 'axios';
import SignUp from 'components/signup';







const SignUpPage :React.FC= () => {  
  return <SignUp/>
}; 

export const getServerSideProps = async ({req}) => {
    const isAuth =  await isAuthenticated(req.session.get('userSession'))
    
    const { status , data} = await axios.get('http://localhost:7000/api/users/check/superadmin')
    if(status===404 || status === 200){
        return {
            props: {},
        };
    }

    return {
        redirect: {
            permanent: false,
            destination: isAuth?'/admin/dashboard':'/admin/login',
        },
    }
}
export default SignUpPage
