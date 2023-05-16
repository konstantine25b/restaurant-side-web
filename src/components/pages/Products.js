import styled from '@emotion/styled'
import React from 'react'
import COLORS from '../../themes/colors'
import { PlusIcon } from "@heroicons/react/24/solid";
import { useLocation, useNavigate } from 'react-router-dom';

export default function Products() {

    const navigate = useNavigate();
    const { state } = useLocation();
    const {restInfo} = state;
    console.log(restInfo.FoodCategories[0].dishes)


  return (
    <MainDiv>
        <Top>
            <TopP>Products</TopP>
            <AddButton onClick={() => navigate(`/HomePage/Products/AddProduct`)}><PlusIcon style={{width: 30 , color: 'white'}} /></AddButton>
        </Top>
        <Bottom>
        <BottomItem>Category</BottomItem>
          <BottomItem>Name (English)</BottomItem>
          <BottomItem>See Details</BottomItem>
          <BottomItem>Avaibility</BottomItem>
          <BottomItem>Correction</BottomItem>
          <BottomItem>Delete</BottomItem>
        </Bottom>
        <BottomList>
          
        {restInfo?.FoodCategories?.map((item) => {
          return(<Bottom2>
            
           <BottomItem2 >{item.Title}</BottomItem2>
           <Bottom3>
            {item.dishes.map((item , index)=>{
            console.log(item.Title)
            
            return (
              <Bottom1 key = {index}>
                <BottomItem1>{item.Title}</BottomItem1>
                <BottomItem1>{item.Title}</BottomItem1>
                <BottomItem1>{item.Title}</BottomItem1>
                <CorrectionButton>Correction</CorrectionButton>
                <DeleteButton>Delete</DeleteButton>
              </Bottom1>
            );
             
          })
          
          }
          </Bottom3>
          </Bottom2>)
          
          
        })}
      </BottomList>
    </MainDiv>
  )
}


const MainDiv = styled.div`
   width: 90%;
   
   margin-top: 40px;
   background-color: ${COLORS.light2};
   display: flex;
   flex-direction: column;
   align-items: center;
   margin-bottom: 100px;

`
const Top = styled.div`
 width: 90%;
 display: flex;
 padding-left: 5%;
 padding-right: 5%;
 justify-content: space-between;
 align-items: center;
 background-color: ${COLORS.lightBlue};
 border: 0.5px solid ${COLORS.insideBlue};
`;
   

const TopP = styled.p`
  font-size: 20px;
  color: white;
`;

const AddButton =styled.div`
width: 40px; 
height: 40px;
background-color: ${COLORS.green};
border-radius: 20%;
display: flex;
align-items: center;
justify-content: center;
&:hover {
    cursor: pointer;
    opacity: 0.8;
  }
`;
const Bottom = styled.ul`
all :unset;
width: 100%;
display: flex;

 justify-content: space-between;
 align-items: center;
 background-color: ${COLORS.lightBlue};
 border: 0.5px solid ${COLORS.insideBlue};
 color: white;
 
`
const BottomItem = styled.li`
all: unset;
padding: 15px;
border-right: 0.5px solid ${COLORS.insideBlue};
width: calc(100%/6);


`
const Bottom1 = styled.ul`
  all: unset;
  width: 100%;
  display: flex;

  justify-content: space-between;
  align-items: center;
  background-color: ${COLORS.light};
  border: 0.5px solid ${COLORS.insideBlue};
  margin: 0px;
  padding: 0px;
`;
const Bottom2 = styled.ul`
  all: unset;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0px;
  padding: 0px;
  
  
 
  background-color: ${COLORS.light};
  border: 0.5px solid ${COLORS.insideBlue};
`;
const Bottom3 = styled.ul`
  all: unset;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  width: calc(100%*5/6) !important;
  margin: 0px;
  padding: 0px;
 
 
  background-color: ${COLORS.light};
  border: 0.5px solid ${COLORS.insideBlue};
`;
const BottomItem1 = styled.li`
  all: unset;
  padding: 15px;
  box-sizing: border-box !important;
  border-right: 0.5px solid ${COLORS.insideBlue};
  width: calc(100%/5) !important;
  
`;
const BottomItem2 = styled.li`
  all: unset;
  padding: 15px;
  box-sizing: border-box !important;
  border-right: 0.5px solid ${COLORS.insideBlue};
  width: calc(100%/6) !important;
  
`;
const BottomList = styled.ul`
width: 100%;
margin: 0;
padding: 0;


`;

const CorrectionButton = styled.li`
all: unset;
height: 100% !important;
padding: 15px;
background-color: ${COLORS.green};
border-right: 0.5px solid ${COLORS.insideBlue};
width: calc(100%/6);
text-align: center;
color: ${COLORS.lightBlue};
&:hover {
  cursor: pointer;
  opacity: 0.8;
}
`
const DeleteButton = styled.li`
all: unset;
padding: 15px;
background-color: ${COLORS.red};
border-right: 0.5px solid ${COLORS.insideBlue};
width: calc(100%/6);
text-align: center;
color: white;
&:hover {
cursor: pointer;
opacity: 0.8;
}
`