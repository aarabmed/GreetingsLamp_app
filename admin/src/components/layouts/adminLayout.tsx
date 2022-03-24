import React from "react";
import dynamic from 'next/dynamic';
import { Row, Col} from "antd";



type props = {
  pageType:string,
  subPage:string
}

const Dashboard = dynamic(
  import('../dashboard')
)

const Users = dynamic(
  import('../user/userIndex')
)
const Tags = dynamic(
  import('../tag/tagIndex')
)

const Cards = dynamic(
  import('../cards')
)

const Page404 = dynamic(
  import('../layouts/Page404')
)


const AdminLayout:React.FC<props> =({
  pageType,
  subPage
})=>{

  const RenderPage:React.FC<{type:string}>= ({type})=>{
    switch (type) {
      case 'dashboard':
        return <Dashboard />
  
      case 'users':
        return <Users />
  
      case 'cards':
        return <Cards/>

      case 'tags':
        return <Tags/>
        
      default:
        return <Page404/>
    }
  }
  
  return (
    <Row  className={'main-page'}>
           <Col className='main-content-admin'>
            <RenderPage type={pageType} /> 
          </Col>
    </Row>
);
} 



export default AdminLayout
