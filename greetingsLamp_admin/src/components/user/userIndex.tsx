import React ,{useState,useEffect} from "react";

import {PageHeader, Table} from "antd";
import useSWR from "swr"
import AddUserModal from './modals/addUser'
import {userCol } from './components/userColumns'
import Spinner from 'components/spin/spiner'
import { useSelector } from "react-redux";

import { USERS } from "common/apiEndpoints";

import UserHeader from './components/userHeader'



const swrConfig = {
  revalidateOnFocus: false,
  refreshWhenHidden: false,
  revalidateIfStale: false,
  refreshInterval: 0
}

const userPage =()=>{
  const [userInfo, setUserInfo] = useState(undefined)
  const [refreachError, setRefreachError] = useState(false)
  const {currentUser} = useSelector((state) => state.userReducer);
  const {authority} = currentUser


    const fetcher = async url => {
      const res = await fetch(url)
      if (res.status===401) {
          const error:any = new Error('Not authorized')
          error.status = res.status
          throw error
        }
        return res.json()
    }

    const { data, error, mutate,isValidating } = useSWR(USERS, fetcher,swrConfig)

    const refreachUserInfo=()=>{
      mutate().then((res)=>{
        const user = res.data.find(elm=>elm._id===userInfo.key)
        if(user){
          setRefreachError(false)
          setUserInfo(user);
          return
        }
        setRefreachError(true)
      })
    }

    useEffect(()=>{
      if(refreachError){
        refreachUserInfo()
      }
    },[])


    const toUsersList = ()=>{
      setUserInfo(undefined)
    }


    const Users = () =>{

        const onFetch = () => {
          mutate()
        }


        const getUser=(item)=>{
          setUserInfo(item)
        }

      

        let newData = []

      
        
        if (!data) return <Spinner />
        if(data){
          newData= data.data.map(elm=>({
            key:elm._id,
            userName:elm.userName,
            email:elm.email,
            authority:elm.authority,
            status:elm.status,
            createdAt:elm.createdAt
          }))
        } 

        
        
        return(
            <>
              <PageHeader
                ghost={false}
                title='Users list'
                extra={[
                  authority===('ADMIN'||'SUPER-ADMIN')?<AddUserModal fetching={onFetch}/>:null,
                ]}
              />
              <div className="gl-table-container">
                <Table loading={isValidating} columns={userCol(getUser)} dataSource={newData} scroll={{x:1150}} /* tableLayout={'unset'} */ pagination={{position:['bottomCenter']}}/>
              </div>
            </>
        )
    }
  


    const SingleUser =({userInfo,runRefreach,toUsersList})=>{

      return <>
        <UserHeader userInfo={userInfo} refreachData={runRefreach} toUsersList={toUsersList}/>
      </>
    } 


    const props = {
      userInfo,
      runRefreach:refreachUserInfo,
      toUsersList,
    }

    return userInfo?<SingleUser {...props} />:<Users/>  
} 

export default React.memo(userPage)
