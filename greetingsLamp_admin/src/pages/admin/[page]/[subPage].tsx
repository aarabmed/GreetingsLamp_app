import React, { useEffect } from "react";
import dynamic from 'next/dynamic';
import { Row, Col} from "antd";
import { useRouter , withRouter} from "next/router";

import PrivatLayout from "components/layouts/PrivateLayout";
import {isAuthenticated} from "common/isAuthenticated";
import Page404 from "components/layouts/Page404";
import Profile from "components/user/profile";
import { withIronSession } from "next-iron-session";

 

const Collections = dynamic(
  import('components/menu-center/collections')
)



const Index=()=>{

  
  const {query} = useRouter();

 
  const RenderPage:React.FC<{type:string}>= ({type})=>{
    const page = query.subPage

    switch (page) {
      case 'profile'  :
        return <Profile /> 
      case 'collections':
      return <Collections />   
      default:
        return <Page404 />
    }
  }

  
  const title = query.subPage.toString()
  
  return (
    <PrivatLayout  title={`${title.charAt(0).toUpperCase() + title.slice(1)} page | Greetings Lamp`}  >
        <Row className={'main-page'}>
          <Col className='main-content-admin'>
            <RenderPage type={query.subPage.toString()}  />
          </Col>
        </Row>
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
    props: {}
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



export default withRouter(Index) 
