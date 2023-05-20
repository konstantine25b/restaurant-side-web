import styled from "@emotion/styled";
import React from "react";
import COLORS from "../../themes/colors";
import { PlusIcon } from "@heroicons/react/24/solid";
import { useLocation, useNavigate } from "react-router-dom";

export default function Categories() {


  const navigate = useNavigate();

  const { state } = useLocation();
  const {restInfo} = state

  const handleDelete = () => {
    // Perform the delete operation here
    // ...

    if (window.confirm('Are you sure you want to delete?')) {
      // Delete confirmed, perform the delete operation
      // ...
      console.log("dssf")
    }
  };
  
 

  return (
    <MainDiv>
      <Top>
        <TopP>Categories</TopP>
        <AddButton
          onClick={() => navigate(`/HomePage/Categories/AddCategories`)}
        >
          <PlusIcon style={{ width: 30, color: "white" }} />
        </AddButton>
      </Top>
      <Bottom>
        <BottomItem>Name (English)</BottomItem>
        <BottomItem>Name (Gerogian)</BottomItem>
        <BottomItem>Correction</BottomItem>
        <BottomItem>Delete</BottomItem>
      </Bottom>
      <BottomList>
        {restInfo?.FoodCategories?.map((item, index) => {
          return (
            <Bottom1 key = {index}>
              <BottomItem1>{item.Title}</BottomItem1>
              <BottomItem1>{item.Title}</BottomItem1>
              <CorrectionButton>Correction</CorrectionButton>
              <DeleteButton onClick={handleDelete}>Delete</DeleteButton>
            </Bottom1>
          );
        })}
      </BottomList>
    </MainDiv>
  );
}

const MainDiv = styled.div`
  width: 90%;

  margin-top: 40px;
  background-color: ${COLORS.light2};
  display: flex;
  flex-direction: column;
  align-items: center;
`;
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

const AddButton = styled.div`
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
  all: unset;
  width: 100%;
  display: flex;

  justify-content: space-between;
  align-items: center;
  background-color: ${COLORS.lightBlue};
  border: 0.5px solid ${COLORS.insideBlue};
`;
const BottomItem = styled.li`
  all: unset;
  padding: 15px;
  border-right: 0.5px solid ${COLORS.insideBlue};
  width: 25%;
  color: white;
`;

const Bottom1 = styled.ul`
  all: unset;
  width: 100%;
  display: flex;

  justify-content: space-between;
  align-items: center;
  background-color: ${COLORS.light};
  border: 0.5px solid ${COLORS.insideBlue};
`;
const BottomItem1 = styled.li`
  all: unset;
  padding: 15px;
  border-right: 0.5px solid ${COLORS.insideBlue};
  width: 25%;
`;
const BottomList = styled.ul`
  width: 100%;
  margin: 0;
  padding: 0;
`;

const CorrectionButton = styled.li`
  all: unset;
  padding: 15px;
  background-color: ${COLORS.green};
  border-right: 0.5px solid ${COLORS.insideBlue};
  width: 25%;
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
width: 25%;
text-align: center;
color: white;
&:hover {
  cursor: pointer;
  opacity: 0.8;
}
`