import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { GetStaticProps } from 'next';
import HomePage from '../components/layouts/HomePageLayout'
import { FetchMenu } from 'common/utils';
import SplashPage from 'components/loader/loading';

export default function Index(props) {
  const [visible, setVisible] = useState(true);
  const [className, setClass] = useState(''); 
  useEffect(()=>{
    setTimeout(() => {
      setClass('splashFadeOut')
      setTimeout(() => {
        setVisible(false)
      }, 300);
    }, 8500);
  },[])





  return <>
     {visible?<div className={'splash '+className}><SplashPage/></div>:null}
     <HomePage {...props}/>
  </>
}


 
export const getStaticProps: GetStaticProps = async (context) => {

  const res = await axios.get(`${process.env.API_BASE_URL}/collections`)
  const menu = await FetchMenu(res)

  const {data,status} = await axios.get(`${process.env.API_BASE_URL}/cards/?sort=popular&count=20`)

  if (!res) {
    return {
      notFound: true,
    }
  }

  return {
    props:{
      headerData:{
        menuData:menu,
        bannerData:null
      },
      sidebarData:null,
      mainContent:{
        populatedCards:status===200?data.cards:[],
        populatedInvitations:status===200?data.invitations:[]
      }
    }
  }
}
 


