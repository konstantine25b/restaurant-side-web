import styled from "@emotion/styled";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import COLORS from "../../../../themes/colors";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";

export default function CategoriesDetailsPage() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const { NameEng, NameGeo, Image, categoryInfo, restId } = state;
  console.log(state);

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
        <TopP>{NameEng}</TopP>
      </Top>
      <Top>
        <TopP>Name (Georgian):</TopP>
        <TopP>{NameGeo}</TopP>
      </Top>

      <Top>
        <TopP>Image:</TopP>
        <ProductImage src={Image} />
      </Top>
    </MainDiv>
  );
}

// Reusing styled components from DetailsPage
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

const ProductImage = styled.img`
  width: 240px;
`;
