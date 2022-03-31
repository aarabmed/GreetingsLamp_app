import React from "react";
import { PageHeader, Table} from "antd";
import Spinner from "components/spin/spiner"
import useSWR from "swr"
import axios from 'axios'
import moment from 'moment'

import {tagColumns } from './tables/tagColumns'
import AddTag from "./components/tagType";
import { TAGS } from "common/apiEndpoints";


const TagIndex =()=>{
  const fetcher = url => axios.get(url).then(res => res.data)
  const { data, error ,mutate} = useSWR(TAGS, fetcher)

  const tableHeader = () =>(
    <div className='tableHeader'>
      
    </div>
  )

  const TagPage = () =>{
    let newData = [];

    if(error){
      return (
        <h5>No data to load !!</h5>
      )
    }
    if (!data) return <Spinner />
    else newData = data.tags.map(elm=>({
      ...elm,
      key:elm._id,
      name:elm.name,
      slug:elm.slug,
      createdAt:moment(elm.createdAt).format('DD MMM YYYY'),
      status:elm.status,
    }))


    return <>
              <PageHeader
                ghost={false}
                title='Tag list:'
                extra={[
                  <AddTag mode='add' runMutate={()=>mutate()} />,
                ]}
              />
              <div className="gl-table-container">    
                  <Table columns={tagColumns} dataSource={newData} scroll={{x:1070}} />
              </div>
      </>   
    }

  return <TagPage/>
} 

export default TagIndex
