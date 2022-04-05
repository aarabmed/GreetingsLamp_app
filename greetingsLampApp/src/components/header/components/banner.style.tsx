import styled,{css, keyframes } from 'styled-components';
import ColorLignten from 'common/lightenColor'
import { fadeInDown,fadeInUp } from 'react-animations';

const fadeInDownAnimation = keyframes`${fadeInDown}`;

const fidAnimation = css`
      ${fadeInDownAnimation} 1s
`
export const BannerContainer =styled.div<{color:string}>`
background:linear-gradient(132deg,${((div)=>ColorLignten(div.color,80))} 0%,${(div)=>div.color} 80%);
width:100%;
height: 100%; 
display:flex;
align-items: center;
flex-direction:collumn;
img{
   height:100%;
   margin: 5px;
   animation:${fidAnimation};
}
`

const fadeInUpAnimation = keyframes`${fadeInUp}`;
const fiuAnimation = css`
      ${fadeInUpAnimation} 1s;
`
export const BannerContent = styled.div`
   display: flex;
   flex-direction: column;
   justify-content: center;
   animation:${fiuAnimation};
   padding: 30px;
   text-shadow: -1px 3px 8px #00000042;
   line-height: 1;
   width: 55%;
   margin: auto;
`
   
export const HeaderTitle = styled.h1`
   font-size: 3vw;
   font-weight: bold;
   color: azure;
`


export const HeaderSubTitle = styled.h4`
   font-size: 1.3vw;
   color: azure;
`





 