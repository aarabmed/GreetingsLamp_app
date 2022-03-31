
import React from "react";
import { IKImage, IKContext } from 'imagekitio-react'

import {BannerContainer,BannerContent, HeaderSubTitle,HeaderTitle} from './banner.style'
function Banner({bannerData}) {
  const {backgroundColor,image,title,description} = bannerData
 
  return (
    <div className='header__banner'>
      <BannerContainer color={backgroundColor}>
        <IKContext urlEndpoint="https://ik.imagekit.io/gl">
            <IKImage path={image.filePath} 
            transformation={[{
                "height": "500"
            }]}
            key={Math.random()*21}
            />
        </IKContext>
        <BannerContent key={Math.random()*11}>
          <HeaderTitle>{title}</HeaderTitle>
          <HeaderSubTitle>{description}</HeaderSubTitle>
        </BannerContent>
      </BannerContainer>
    </div>
  );
}

export default Banner;
