import axios from 'axios';
import React from 'react';
import { GetStaticProps } from 'next';
import HomePage from '../components/layouts/HomePageLayout'
import { FetchMenu } from 'common/utils';
export default function Index(props) {
  return (
    <HomePage {...props} />
  );
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
 


