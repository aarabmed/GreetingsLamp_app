import React, { useEffect, useState } from "react";
import  { useRouter } from 'next/router';
import PublicLayout from "components/layouts/PublicLayout";
import Page404 from "components/layouts/Page404"
import axios from "axios";
import { PageHeader, Image, Button, Tag, List, Divider } from "antd";
import { FetchMenu } from "common/utils";
import { saveAs } from 'file-saver'
import Link from 'next/link'
import Card from 'components/cards/bc-card'

const { Body } = Card



const axiosInstance = axios.create({
  validateStatus: function (status)
  {
      return true
  }
});

const axiosHeader = (value?)=>{
  const config = {
      headers: { 'Content-type': 'application/json' },
      params:value
  };
  return config
}


const Index = ({publicLayoutData,mainContent}) => {
    const { query,push } = useRouter();
     
    const [visible, setVisible] = useState(false); 

    const {card}  = mainContent
    
    
    if(!card)return <Page404 menu={publicLayoutData.headerData.menuData}/>


    const downloadImage =(card)=>{
      const body = {
        cardId:card._id
      }
      axiosInstance.patch(
        '/api/cards/download',
        body,
        axiosHeader(),
        ).then(res=>{
          console.log('RES:::',res)
        }).catch(e=>{
          console.log('Error:',e)
        })
      saveAs(card.image.url, card.slug )
    }

    const similarCards = card.similarCards.map(card=>
      <Card 
      key={card._id}
      cover={card.image.filePath}
      itemId={card._id}
      width="230px"
      currentPath={`/preview/${query.collection}/${card.slug}`}
    
        >
          <Body title={card.title} />
        </Card> 
    )
    
    const onImageClick =()=>{
      setTimeout(() => {
        
        const imageMask = Array.from(document.getElementsByClassName('ant-image-preview-root'))
        imageMask.forEach((element:HTMLElement) => {
              element.oncontextmenu = (e)=>{
                e.preventDefault();
              }
        })
      }, 100);
      
    }

    function capitalize(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }

   
    const initialRoutes = card.routeToCard.data.map(item=>({path:item.slug,breadcrumbName:item.name}))
    const routes = [...initialRoutes,{path:'',breadcrumbName:card.title}]
    const type = capitalize(card.cardType);
    return (
      <PublicLayout data={publicLayoutData} title={`${card.title} - ${card.routeToCard.data[1].name} ${type} (free) | Greetings Lamp`} ContentResponsive={{ xs: 24, lg: 24 }} >
        <>
          <PageHeader
            className="site-page-header"
            breadcrumb={{routes,itemRender:(route,params,routes)=>routes[routes.length-1].path!==route.path?<Link href={`/${route.path}`}>{route.breadcrumbName}</Link>:<span> {card.title}</span>}}
          />
            <div className="preview-wrapp">
              <div className="card-preview-container">
                <div className="card-image">
                  <div className="card-envelope">
                    <img src="/assets/images/envelope.png" />
                  </div>
                  <div className="mask"></div>
                  <Image
                    preview={{visible,src:`https://ik.imagekit.io/gl${card.image.filePath}`,onVisibleChange: vis => setVisible(vis)}}
                    width={200}
                    src={`https://ik.imagekit.io/gl/tr:h-470${card.image.filePath}`}
                    onClick={onImageClick}
                    draggable={false}
                    onContextMenu={(e)=> e.preventDefault()}
                  />
                  
                </div>
                <div className="card-details">
                    <h2>{card.title} - {card.routeToCard.data[1].name} {card.type}</h2>
                    <div className="download-button">
                      <Button type="primary" onClick={()=>downloadImage(card)}>Download Image</Button>
                    </div>
                    <div className="card-details-list">
                        <ul>
                          <li>description: {card.description}</li>
                          <li>Orientions: {card.orientation}</li>
                          <li>size: [ {card.dimensions.height}px , {card.dimensions.width}px ]</li>
                          <li>Tags: {card.tags.map((item)=>(<Tag color="magenta" key={item._id}>{item.name}</Tag>))}</li>
                        </ul>
                    </div>
               </div>
              </div>
              {similarCards.length?<div className="similar-cards">
                  <Divider>You may also like</Divider>
                  <List
                    className="cards-container"
                    itemLayout='horizontal'
                    pagination={false}
                    dataSource={similarCards}
                    renderItem={item=>item}
                  />
              </div>:null}
            </div>
          </>
        
    </PublicLayout>
    )
}






export const getServerSideProps =async ({req,res,params}) => {

  
      
      const collectionResponse = await axios.get(`${process.env.API_BASE_URL}/collections`);
      
      const cardResponse = await axios.get(`${process.env.API_BASE_URL}/cards/${params.id}`);
      const menu  = await FetchMenu(collectionResponse)

  
      return {
        
          props:{
            publicLayoutData:{
              headerData:{
                menuData:menu,
                bannerData:null
              },
              sidebarData:null,
            },
            mainContent:cardResponse.data
          }
        
      }
  
  }

export default Index
