import Page404 from "components/layouts/Page404"
import React, {useState,useContext,useEffect} from "react"
import PrivateLayout from "components/layouts/PrivateLayout"

const Index = ()=> {
  return<PrivateLayout title={"Page not found | Greetings Lamp"}>
      <Page404 homeButton={true}/>
  </PrivateLayout>

}



export default Index
