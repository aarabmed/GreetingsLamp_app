import styled from 'styled-components';


export const ListItems = styled.ul`
    display:flex;
    flex-direction:row;
    li{
        padding:0 15px;
        border-right:2px solid #838383;
        span{
            font-weight:bold;   
        }
    };
    li:last-child{
        border:none
    }
`