import styled from "@emotion/styled";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import COLORS from "../../themes/colors";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";

export default function DetailsPage() {
  const navigate = useNavigate();
  const { state } = useLocation();

  // aq indexebit momaqvs imitom rom mere martivad vipovo restionfos categoriebshi
  const { restInfo, categoryIndex, dishIndex } = state;
  const dishInfo = restInfo.FoodCategories[categoryIndex].dishes[dishIndex];
  console.log(dishInfo)

  const firstData = {
    Category: restInfo.FoodCategories[categoryIndex].Title,
    NameEng: dishInfo.Title,
    Description: dishInfo.Description,
    AproxTime: dishInfo.ApproxTime,
    Ingredients: dishInfo.Ingredients,
    Price: dishInfo.Price,
  };
  return (
    <MainDiv>
         <BackButton
          onClick={() => {
            navigate(-1);
          }}
        >
          <ArrowLeftIcon style={{ width: 20, color: "white" }} />
        </BackButton>
      <Top>
        <TopP>Name (English):</TopP>
        <TopP>{firstData.NameEng}</TopP>
      </Top>
      <Top>
        <TopP>Category Name:</TopP>
        <TopP>{firstData.Category}</TopP>
      </Top>
      <Top>
        <TopP>Description:</TopP>
        <TopP>{firstData.Description} </TopP>
      </Top>
      <Top>
        <TopP>Aproximate Time:</TopP>
        <TopP>{firstData.AproxTime} minute</TopP>
      </Top>
      <Top>
        <TopP>price :</TopP>
        <TopP>{firstData.Price} </TopP>
      </Top>
      <Top>
        <TopP>Ingredients:</TopP>
        {firstData.Ingredients.map(item=>{
            return  item? <TopP>{item} ,</TopP>: null
        })}
      </Top>
    </MainDiv>
  );
}

const MainDiv = styled.div`
  width: 90%;

  margin-top: 40px;

  display: flex;
  flex-direction: column;

  margin-bottom: 100px;
`;
const Top = styled.div`
  width: 90%;
  display: flex;
  padding-left: 5%;
  padding-right: 5%;
  justify-content: left;
  align-items: center;
`;
const TopP = styled.p`
  font-size: 20px;
  color: black;
  padding-right: 20px;
`;
const BackButton = styled.div`
  width: 40px;
  height: 30px;
  background-color: ${COLORS.insideBlue};
  border-radius: 10%;
  margin-bottom: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    cursor: pointer;
    opacity: 0.8;
  }
`;
