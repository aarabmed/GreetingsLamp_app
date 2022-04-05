import React from "react";
import { useRouter } from 'next/router';
import PublicLayout from "components/layouts/PublicLayout";
import axios from "axios";
import Card from "components/cards/bc-card"
import { List, PageHeader } from "antd";
import Page404 from "components/layouts/Page404";
import Link from "next/link";

const { Body } = Card 

export default function index({publicLayoutData,mainContent,menuData}) {
    const router = useRouter();
    const {query,pathname,asPath} = router;
    const subCategory: any = query.subCategory

    // return page error 404  ////
    if(mainContent.status===404)return<Page404 menu={menuData}/>

    const Cards = mainContent.cards.map(card=>{
      return(<Card 
              key={card._id}
              cover={card.image.filePath}
              itemId={card._id}
              width="230px"
              currentPath={`/preview/${query.collection}/${card.slug}`}
                >
                <Body title={card.title} />
              </Card> 
      )
    })

    const onPageChange =(page)=>{
      router.replace({pathname,query:{'page':page}},asPath)
    }
  

    function capitalize(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }
  
  
    const  currentRoute=[{path:'',breadcrumbName:'Home'}]
    Object.keys(query).forEach((key,index) => {
      let name = query[key].toString()
      let breadcrumbName = name.split('-').map(capitalize).join(' ');
      if(index>0){
        name = currentRoute[index].path+'/'+name
        return currentRoute.push({path:name,breadcrumbName:breadcrumbName})
      }
      currentRoute.push({path:name,breadcrumbName:breadcrumbName})
    })
  
    const { bannerData } = publicLayoutData.headerData

    return (
    <PublicLayout data={publicLayoutData} title={`${bannerData.title} (free) | Greetings Lamp`}  ContentResponsive={{ xs: 24}} >
        <PageHeader
            className="site-page-header"
            breadcrumb={{routes:currentRoute,itemRender:(route,params,routes)=>routes[routes.length-1].path!==route.path?<Link href={`/${route.path}`}>{route.breadcrumbName}</Link>:<><span style={{fontWeight: 600}}>{route.breadcrumbName}</span><span className="breadcump-result">{mainContent.totalResults} results</span> </>}}
        />
        <div className="cards-grid">       
          <List
            className="cards-container"
            itemLayout='horizontal'
            dataSource={Cards}
            renderItem={item=>item}
            pagination={{
              onChange:onPageChange,
              current:mainContent.currentPage,
              pageSize:24,
              showSizeChanger:false,
              total:mainContent.totalResults,
            }}
          />  
          </div>
    </PublicLayout>
  );
}



export const getServerSideProps = async (ctx) => {

    let cardsResponse = {
      data:{
        status:404,
        cards:[],
      }
    }

    const res = await axios.get(`${process.env.API_BASE_URL}/collections`)
   
    const menu = await res.data.collections.filter((col)=>{
      if(col.status===true){
          return true
      }
    }).map(col=>{
      if(col.category){
        return ({...col,category:col.category.filter(cat=>cat.status===true).map(sub=>{
          if(sub.subCategory){
            return({...sub,subCategory:sub.subCategory.filter(e=>e.status===true)})
          }
        })})
      }
    })
    
    const collection  = menu.filter(coll=>coll.slug===ctx.params.collection)[0]
    
    const category = collection ? collection.category.filter(cat=>cat.slug===ctx.params.category)[0] : null
    
    const subCategory = category ? category.subCategory.filter(sub=>sub.slug===ctx.params.subCategory)[0] :null   
    
    if(!category || !subCategory  ){
      return {
        props:{
          mainContent:cardsResponse.data,
          menuData:menu,
        }
      }
    }


    cardsResponse = await axios.get(`${process.env.API_BASE_URL}/cards/?subCategory=${subCategory._id}&page=${ctx.query.page}&size=24`)


    const sidebar = {
      categoryActive:{
        name:category.name,
        slug:category.slug,
        key:category._id
      },
      subCategoryActive:[{
        name:subCategory.name,
        slug:subCategory.slug,
        key:subCategory._id
      }],
      subCategories:category.subCategory,
    }

  
    return {
        props:{
          publicLayoutData:{
            headerData:{
              menuData:menu,
              bannerData:subCategory
            },
            sidebarData:sidebar
          },
          mainContent:cardsResponse.data,
        }
    }
  }
  
  

