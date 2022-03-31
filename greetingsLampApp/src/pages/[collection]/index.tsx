import React from "react";
import { useRouter } from 'next/router';
import axios from "axios";
import Head from "next/head";
import { Row } from "antd";
import Header from "components/header";
import {TitleSection} from "components/style/title.style"
import Link from "next/link";
import { FetchMenu } from "common/utils";
import Footer from "components/footer/Footer";
import Page404 from "components/layouts/Page404";
import { IKImage, IKContext } from 'imagekitio-react'



export default function index(props) {
    const { query } = useRouter();
    


    const collection: any = query.collection

    if(props.mainContent.status===404)return<Page404 menu={[]}/>

    const selectedCollection = props.headerData.bannerData;
    const CardsBySubcategories = ({item})=>{
       const subCategory = props.mainContent.data.find(el=>el._id===item)
       if(subCategory)return   subCategory.cards.map((card,index)=>
          <IKContext urlEndpoint="https://ik.imagekit.io/gl">
              <IKImage path={card.image} 
              key={card._id}
              className={`thumb-img-${index}`}
              transformation={[{
                  "width": "300"
              }]}
              loading="lazy"
              lqip={{ active: true }}
              />
          </IKContext>
        )
        return <img className="thumb-img-notfound" src="/assets/images/image-not-found.png"/>
    } 
    const Sections = (selectedCollection)=>{  
      const SectionDiv = selectedCollection.category.map((cat,index)=>{
        return(
            <div key={cat._id} className={`collection-section`}>
              <TitleSection color={cat.backgroundColor}>{cat.title}</TitleSection>
              <div className="items">
                {cat.subCategory.map(sub=>
                    (<div key={sub._id} className="item-thumb">
                        <div className="item-thumb-imgs">
                            <CardsBySubcategories item={sub._id} />
                        </div>
                        <Link href={`/${collection}/${cat.slug}/${sub.slug}`}><a>{sub.name}</a></Link>
                    </div>))
                  }  
              </div>
            </div>
        )})
        return <div className="section-wrapper">
          {SectionDiv}
        </div>
    }
  return (
    <>
      <Head>
          <title>Online cards collection '('free')' | Greetings Lamp </title>
      </Head>
      <div className="content-public">
        <Row>
            <Header {...props.headerData}/>
        </Row>
        <Sections {...selectedCollection}/>
      </div>
      <Footer/>
    </>
  );
}



export const getServerSideProps = async ({params}) => {

    const res = await axios.get(`${process.env.API_BASE_URL}/collections`)
    let type

    switch (params.collection) {
      case 'cards':
          type="card"
        break;
      case 'invitations':
          type="invitation"
        break;
      default:
          type=''
        break;
    }
    const menu = await FetchMenu(res)
    const collection = menu.filter(coll=>coll.name.toLowerCase()===params.collection)[0]

    let checkCollection= collection ? true : false
    if(!checkCollection){
      return {
        props:{
          mainContent:{
              status:404,
              data:null
          },
        }
      }
    }

    

    const cardsBySubcategories = await axios.get(`${process.env.API_BASE_URL}/cards/bysub-categories?type=${type}`)

    
  
    return {
        props:{
          headerData:{
            menuData:menu,
            bannerData:collection
          },
          sidebarData:null,
          mainContent:cardsBySubcategories.data
        }
  }
  
} 

