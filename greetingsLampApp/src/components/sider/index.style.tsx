import styled ,{css}from 'styled-components';


export const MenuTitle = styled.h3<{active:boolean}>`

    padding:10px 7px;
    font-size: 1.1em;
    font-weight: bold;
    cursor:pointer;
    &:hover{
        color:gray;
    };
    ${props => !props.active && css`&{
        content: '';
        border-bottom: solid 2px #9df600;
        width: 50%;
        display: flex;
        margin-top: 4px;
    }`}
`