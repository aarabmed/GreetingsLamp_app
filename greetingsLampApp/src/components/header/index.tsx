import React from "react";
import Banner from "./components/banner"
import TopMenu from "./components/top-menu"
function Header({bannerData,menuData}) {
  const logoIMG = '/assets/images/greetingslamp-logo.png'
  return (
    <div className='public__header'>
          <TopMenu  logo={logoIMG} Elements={menuData}/>
          {bannerData?<Banner bannerData={bannerData}/>:null}
    </div>
  );
}

export default React.memo(Header);
