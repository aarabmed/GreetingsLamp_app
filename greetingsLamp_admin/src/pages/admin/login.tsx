import { Alert } from 'antd';
import React, { useState,useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import Spinner from "components/spin/spiner"
import { withIronSession,   } from "next-iron-session" 

import {doesConnectionExist} from 'common/check-internet'
import {setRoute} from "redux/actions/globalActions";
import {setUser} from "redux/actions/userActions";

import LoginFrom from 'components/login';
import { LOGIN } from 'common/apiEndpoints';
import { isAuthenticated } from 'common/isAuthenticated';
import Head from 'next/head';



const { UserName, Password, Submit } = LoginFrom;

export interface LoginParamsType {
  userName: string;
  password: string;
}

export interface StateType {
  status?:string;
  type?:string;
  currentAuthority?:'user'|'guest';
} 

export interface User {
  userId:string,
  userName:string,
  token:string,
  authority:string,
  avatar:string,
  email:string
} 


interface Response {
  data?:User;
  status?:number;
  message?:string;
}

interface LoginProps {
  isAuth?: boolean;
  superAdmin?: boolean;
}

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

const Login: React.FC<LoginProps> = ({isAuth}) => {  
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true)

  const [errorMessage, setErrorMessage] = useState(null);
  const {route} = useSelector((state) => state.globalReducer);
  const router = useRouter()
  const dispatch = useDispatch();

  useEffect(()=>{
  
    if(!isAuth) setLoading(false); 
    if(isAuth){
      router.push(`${route}`);
    }
    
  },[])


  

  const handleSubmit = async (values: LoginParamsType) => {
    setSubmitting(true);
    
    doesConnectionExist().then(res=>{

      if(!res){
          setSubmitting(false)
          setErrorMessage('Please make sure you are connected to the internet, then try again')
      }

    })
    
    

    const newRoute:string = route===''?'dashboard':route

    if(newRoute==='dashboard'){
      dispatch(setRoute("dashboard"))
    }

    const res:Response = await fetch(
       LOGIN,{
        method: 'POST',
        body: JSON.stringify(values),
        headers: { 'Content-Type': 'application/json' }
      }).then(async res=>{

        return res.json()      
        
      }).catch(e=>{
          setSubmitting(false);
          setErrorMessage('Error while connecting to Database, try later')
    })
    
    if(res?.status===200){
        const user = {
          userId:res.data.userId,
          userName:res.data.userName,
          authority:res.data.authority,
          avatar:res.data.avatar,
          email:res.data.email
        }       

        dispatch(setUser(user))

        dispatch(setRoute(newRoute))
        return router.push(newRoute)
    }else{
        setSubmitting(false);
        setErrorMessage('Error while submiting the form')
    }
  } 

 
  if(loading) return <div className='indexSpinner'><Spinner/></div>
  return (
    <>
    <Head><title>Login | Greetings Lamp </title></Head>
    <div className='login-container'>
      <div className="main">
        <img src='/assets/images/greetingslamp-logo.png'/>
        <LoginFrom onSubmit={handleSubmit}>
          <div>
            {errorMessage&& (
              <LoginMessage content={errorMessage} />
            )}
            <UserName
              name="userName"
              placeholder="Username"
              rules={[
                {
                  required: true,
                  message: 'Please, type in your username',
                },
              ]}
            />
            <Password
              name="password"
              placeholder="Password"
              rules={[
                {
                  required: true,
                  message: 'Please, type in your password',
                },
              ]}
            />
          </div>
          <div>
            <a>
              Forgot password
            </a>
          </div>
          <Submit loading={submitting}>Submit</Submit>
        </LoginFrom>
      </div>
    </div>
    </>
  );
}; 


export const getServerSideProps = withIronSession(async ({req}) => {
  const isAuth = await isAuthenticated(req.session.get('userSession'))
  if(isAuth){
    return {
        redirect: {
          permanent: false,
          destination: '/admin/dashboard',
        },
    }
  }
  return {
    props: {
      isAuth,
    },
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
export default Login
