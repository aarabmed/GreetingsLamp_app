import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { FetchMenu } from "common/utils";
import Page404 from "components/layouts/Page404";
import Card from "components/cards/bc-card"
import { useRouter } from "next/router";
import { BackTop, Col, List, Row } from "antd";
import Container from "components/other/Container";
import Header from "components/header";
import { Footer } from "antd/lib/layout/layout";
import Head from "next/head";
import SearchFrom from "components/header/components/searchForm";
import useSWR from "swr";
import { SEARCH } from "common/apiEndpoints";
const { Body } = Card 



const swrConfig = {
  revalidateOnFocus: false,
  refreshWhenHidden: false,
  revalidateIfStale: false,
  refreshInterval: 0
}

const Index =({mainContent,publicLayoutData,menuData})=>{
    const router = useRouter();
    const backToTop = useRef(null);
    const searchRef = useRef(null)
   
    const [pageNumber, setPage] = useState(0);
    const [typeCards, setTypeCards] = useState('all');
    const [qq, setq] = useState('');

    const { query,pathname } = router;
    
    let Cards = []

    const fetcher = (url) => axios.get(url).then(res => res.data)
 
    const { data, error, mutate,isValidating } = useSWR(`${SEARCH}?q=${qq}&type=${typeCards}&page=${pageNumber}&size=24`, fetcher,swrConfig)
  


    useEffect(()=>{
      const {q,type,page,size} = query
      if(q){
        setq(q.toString())
      }
      if(type){
        setTypeCards(type.toString())
      }
      if(page){
        setPage(Number(page))
      }


    },[])

    if(mainContent.status===404)return<Page404 menu={menuData}/>
  
    if(data){
      Cards = data.cards.map(card=>{
          return (<Card 
          key={card._id}
          cover={card.image.path}
          itemId={card._id}
          width="230px"
          currentPath={`/preview/${card.collectionName}/${card.slug}`}
          //onClick={cardOnClick}
        
            >
              <Body title={card.title} />
            </Card> 
          )
      })
   }


    const onChangeSearch=(e)=>{
      const text = e.target.value
      setq(text)
      if(!text)return router.replace({pathname,query:{}},null,{shallow:true})
      router.replace({pathname,query:{...query,q:text}},null,{shallow:true})
    }

    const onTypeChange =(type)=>{
      router.replace({pathname,query:{...query,type}},null,{shallow:true})
      setTypeCards(type)
    }

    const onPageChange =(page)=>{
      router.replace({pathname,query:{'page':page}},null,{shallow:true})
      setPage(page)
    }
   

    const Filters = ()=>{
      const type = typeCards?typeCards.toLowerCase():'all'
      const { menuData} = publicLayoutData.headerData
      const list =  [<li onClick={()=>onTypeChange('all')} className={type==='all'?'active':undefined} key='all12'>All</li>,...menuData.map(el=>(<li onClick={()=>onTypeChange(el.name)} className={type===el.name.toLowerCase()?'active':undefined} key={el._id}>{el.name}</li>))]
      return <ul>
        {list}
      </ul>
    }
    return(
        <>
            <Head><title>GreetingsLamp's search page</title></Head>
            <Header {...publicLayoutData.headerData}/>
            <div className="search-banner" ref={searchRef}>
                <SearchFrom fieldValue={qq} onChange={onChangeSearch}/>
            </div>
            <Container type={''} cName={'container-public'}>       
              <Row className="gutter-row">
                  <div className="search-filters">
                        <div className="wrapper">
                          <div className="keyword">
                            <p>Search results for : <span>"{query.q?query.q:'..'}"</span></p>
                          </div>
                          <div className="filters">
                              <Filters/>
                          </div>
                        </div>
                  </div>
                  <Col className="gutter-row content-side" {...{ xs: 24, lg: 24 }}>
                    <div className="cards-grid">
                        <List
                            className="cards-container"
                            itemLayout='horizontal'
                            dataSource={Cards}
                            renderItem={item=>item}
                            pagination={{
                                onChange:onPageChange,
                                current:data?data.currentPage:0,
                                pageSize:24,
                                showSizeChanger:false,
                                total:data?data.totalResults:null
                            }}
                        />
                    </div>
                    <BackTop />
                  </Col>
              </Row>
            </Container>
            <Footer/>
        </>
    )
}

export default Index;


export const getServerSideProps = async (context) => {

    let cardsResponse = {
        data:{
          status:200,
          cards:[],
        }
    }

    const resCollections = await axios.get(`http://localhost:5000/api/collections`)

    const menu = await FetchMenu(resCollections)
   

    if(!resCollections || !menu ){
        return {
          props:{
            mainContent:{
              status:404,
              cards:[],
            },
            menuData:[],
          }
        }
    }


    return {
        props:{
            publicLayoutData:{
                headerData:{
                    menuData:menu,
                    bannerData:null
                },
                sidebarData:null,
            },
            mainContent:cardsResponse.data
        }
  }
  
} 
