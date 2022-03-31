import React, { useEffect, useMemo, useRef, useState } from "react";
import { Row, Col, List, Empty, Pagination, Button, PageHeader } from "antd";
import Card from './components/bc-card'
import ViewCard, { cardType } from './components/modals/viewCard'
import axios from "axios";
import { CARDS } from "common/apiEndpoints";
import useSWR from "swr";
import { useSelector, useDispatch } from "react-redux";
import { setNumberItemsPerPage,setPageNumber } from "redux/actions/cardActions";
import AddCard from './components/modals/addCard'
import {withAuth} from 'common/isAuthenticated'


const { Body } = Card


const axiosHeader = (value)=>{
  const config = {
    params:value
  };
  return config
}


const fetcher = (url,params) => axios.get(url,axiosHeader(params)).then(res => res.data)

const swrConfig = {
    revalidateOnFocus: false,
    refreshWhenHidden: false,
    refreshInterval: 0
}


const defaultCard:cardType={
  _id:'',
  title:'',
  description:'',
  slug:'',
  status:false,
  orientation:'',
  createdBy:{
    email:'',
    userId:'',
    userName:'',
    avatar:'',
    authority:'',
    token:'',
  },
  tags:[],
  category:[],
  subCategory:[],
  subCategoryChildren:[],
  image:{filePath:''},
  relatedCategories:[]
}


function Cards(props) {
  const {pageNumber, pageSize} = useSelector((state)=> state.cardReducer)

  const [size,setSize] = useState(pageSize)
  const [isLoading,setLoading] = useState(true)
  const [page,setPageNM] = useState(pageNumber)
  const [selectedCard,setSelectedCard] = useState(defaultCard)
  const [cardsState,setCardsState] = useState([])


  let cards = [];

  const params = useMemo(()=>({page,size}),[page,size])

  const { data, error, mutate } = useSWR([CARDS,params], fetcher,swrConfig)

  if(data){
    
  }

  

  useEffect(()=>{
    if(data){
        cards = data.cards.map(el=>(
          <Card
              key={el._id}
              item={el}
              onClick={onCardClicked}
              afterRemove={refrechData}
              cover={el.image.filePath}
              width={200}
            >
              <Body title={el.title} />
          </Card>
        ))
        setCardsState(cards)
        setTimeout(() => {
          setLoading(false)
        }, 100);
    }
   
  },[data]) 

  const card = useRef(null)

  const dispatch = useDispatch()


  const  onCardClicked = async (item)=>{
    const seletedItem = {
      ...item,
      category:item.category.map(cat=>({_id:cat._id,name:cat.name})),
      subCategory:item.subCategory?item.subCategory.map(sub=>({_id:sub._id,name:sub.name})):[],
      subCategoryChildren:item.subCategoryChildren?item.subCategoryChildren.map(child=>({_id:child._id,name:child.name})):[]
    }
    await withAuth(()=>{
      setSelectedCard({...defaultCard,...seletedItem})
      card.current.openModal()
    },dispatch)
  }


  const refrechData = async ()=>{
    await mutate()
  }


  const onEditCard = async ()=>{
    const res = await mutate()
    if(res){
      const item = res.cards.find(card=>card._id===selectedCard._id)
      setSelectedCard(item)
    }
  }


  

  async function onShowSizeChange(current, pageSize) {
    await withAuth(()=>{
      setSize(pageSize)
      dispatch(setNumberItemsPerPage(pageSize))
    },dispatch)
  }

  async function onPageChange(page){
    await withAuth(()=>{
      setPageNM(page)
      dispatch(setPageNumber(page))
    },dispatch) 
  }


  return (
    <div className="cards-wrapper">
      
      <div className="cards-container">
        <PageHeader
          ghost={false}
          title="Cards list"
          extra={[
            <Button key="1">Load cards</Button>,
            <AddCard  key="2" type="card" collection="cards" runMutate={refrechData} />,
          ]}
        />
        <ViewCard item={selectedCard} ref={card} runMutate={onEditCard} refresh={refrechData}/> 
        <List
            className="cards-container"
            itemLayout='horizontal'
            pagination={{
              onChange:onPageChange,
              current:pageNumber,
              pageSize:size,
              pageSizeOptions:['12','24','48','96'],
              showSizeChanger:true,
              onShowSizeChange:onShowSizeChange,
              total:data?data.totalResults:null
            }}
            dataSource={cardsState}
            renderItem={item=>item}
            loading={isLoading}
          />
      </div>
    </div>
  );
}



export default React.memo(Cards);



            