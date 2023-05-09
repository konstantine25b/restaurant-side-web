import styled from '@emotion/styled'
import React from 'react'
import COLORS from '../../themes/colors'
import { PlusIcon } from "@heroicons/react/24/solid";
import { useNavigate } from 'react-router-dom';

export default function Categories() {

    const navigate = useNavigate();

  return (
    <MainDiv>
        <Top>
            <TopP>Categories</TopP>
            <AddButton onClick={() => navigate(`/Categories/AddCategories`)}><PlusIcon style={{width: 30 , color: 'white'}} /></AddButton>
        </Top>
        <Bottom>
          <BottomItem>Name (English)</BottomItem>
          <BottomItem>Name (Gerogian)</BottomItem>
          <BottomItem>Correction</BottomItem>
          <BottomItem>Delete</BottomItem>
        </Bottom>
    </MainDiv>
  )
}


const MainDiv = styled.div`
   width: 80%;
   
   margin-top: 40px;
   background-color: ${COLORS.light2};
   display: flex;
   flex-direction: column;
   align-items: center;

`
const Top = styled.div`
 width: 90%;
 display: flex;
 padding-left: 5%;
 padding-right: 5%;
 justify-content: space-between;
 align-items: center;
 background-color: ${COLORS.light2};
 border: 0.5px solid ${COLORS.insideBlue};
`;
   

const TopP = styled.p`
  font-size: 20px;
`;

const AddButton =styled.div`
width: 40px; 
height: 40px;
background-color: ${COLORS.insideBlue};
border-radius: 20%;
display: flex;
align-items: center;
justify-content: center;
`;
const Bottom = styled.ul`
all :unset;
 width: 100%;
 display: flex;

 justify-content: space-between;
 align-items: center;
 background-color: ${COLORS.light2};
 border: 0.5px solid ${COLORS.insideBlue};
`
const BottomItem = styled.li`
all: unset;
padding: 15px;
border-right: 0.5px solid ${COLORS.insideBlue};
width: 25%;
`
