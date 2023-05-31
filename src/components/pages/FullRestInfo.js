import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getRestaurant } from "../../Processing/Database";
import styled from "@emotion/styled";
import COLORS from "../../themes/colors";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";

export default function FullRestInfo() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { restName } = state;

  const [restInfo, setRestInfo] = useState();

  const getRestaurantInfo = async () => {
    setRestInfo(await getRestaurant(restName));
  };
  useEffect(() => {
    console.log(restName);
    // amit saxelis sashualebit momaq restornis info

    getRestaurantInfo();
  }, [restName]);

  console.log(restInfo);

  return (
    <MainDiv>
      
      <Top>
        <TopP>Restaurant Name: </TopP>
        <TopP>{restInfo?.Title}</TopP>
      </Top>
      <Top>
        <TopP>Genre: </TopP>
        <TopP>{restInfo?.Genre} </TopP>
      </Top>
      <Top>
        <TopP>Address: </TopP>
        <TopP>{restInfo?.Address} </TopP>
      </Top>
      <Top>
        <TopP>Description:</TopP>
        <TopP>{restInfo?.FullDescription} </TopP>
      </Top>
      <Top>
        <TopP>Tags:</TopP>
        {restInfo?.Tags.map(item=>{
            return  item? <TopP>{item} ,</TopP>: null
        })}
      </Top>
      <Top>
        <TopP>Main Image:</TopP>
        <MainImage src={restInfo?.MainImage} alt={restInfo?.Title}/>
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


const MainImage = styled.img`
  width: 100px;
  height: 100px;
  border: 0.5px solid ${COLORS.insideBlue}; 
`