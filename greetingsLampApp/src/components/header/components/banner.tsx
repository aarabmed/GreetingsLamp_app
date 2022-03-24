
import React from "react";
import {BannerContainer,BannerContent, HeaderSubTitle,HeaderTitle} from './banner.style'
function Banner({bannerData}) {
  const {backgroundColor,image,title,description} = bannerData
 
  return (
    <div className='header__banner'>
      <BannerContainer color={backgroundColor}>
        <img src={image.path} key={Math.random()*21}/>
        <BannerContent key={Math.random()*11}>
          <HeaderTitle>{title}</HeaderTitle>
          <HeaderSubTitle>{description}</HeaderSubTitle>
        </BannerContent>
      </BannerContainer>
    </div>
  );
}

export default Banner;
