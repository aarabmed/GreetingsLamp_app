import styled,{css, keyframes } from 'styled-components';
import ColorLignten from 'common/lightenColor'

export const TitleSection =styled.h3<{color:string}>`
background: -webkit-linear-gradient(9deg,${(div)=>div.color} 5%,${(div)=>ColorLignten(div.color,80)} 15%);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
font-size: 3vw;
font-weight: 700;
padding: 11px 10px;
`