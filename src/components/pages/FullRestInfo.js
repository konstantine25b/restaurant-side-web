import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
// import { getRestaurant } from "../../Processing/Database";
import styled from "@emotion/styled";
import COLORS from "../../themes/colors";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { API } from "../../Processing/PrestoAPI";

export default function FullRestInfo() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { restName } = state;

  const [restInfo, setRestInfo] = useState();

  const getRestaurantInfo = async () => {
    handleGetRestaurantByTitle(restName)
  };
  useEffect(() => {
    console.log(restName);
    // amit saxelis sashualebit momaq restornis info

    getRestaurantInfo();
  }, [restName]);
  const handleGetRestaurantByTitle = async (restaurantTitle) => {
    const restaurantByTitle = await API.getRestaurantByTitle(restaurantTitle);
    setRestInfo(JSON.parse(JSON.stringify(restaurantByTitle)))
  };

  console.log(restInfo);

  return (
    <MainDiv>
      <Top>
        <TopP>Restaurant Name: </TopP>
        <TopP>{restInfo?.title}</TopP>
      </Top>
      <Top>
        <TopP>Genre: </TopP>
        <TopP>{restInfo?.genre} </TopP>
      </Top>
      <Top>
        <TopP>Address: </TopP>
        <TopP>{restInfo?.address} </TopP>
      </Top>
      <Top>
        <TopP>Description:</TopP>
        <TopP>{restInfo?.shortdescription} </TopP>
      </Top>
      <Top>
        <TopP>Tags:</TopP>
        {restInfo?.tags==null ? console.log("no tags" ) : restInfo?.tags.map((item) => {
          return item ? <TopP>{item} ,</TopP> : null;
        })}
      </Top>
      <Top>
        <TopP>Main Image:</TopP>
        <MainImage src={restInfo?.images} alt={restInfo?.Title} />
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
`;
