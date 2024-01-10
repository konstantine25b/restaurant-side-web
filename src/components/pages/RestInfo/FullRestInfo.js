import React from "react";
import { useLocation } from "react-router-dom";
import styled from "@emotion/styled";
import COLORS from "../../../themes/colors";
import { API } from "../../../Processing/PrestoAPI";
import { useQuery } from "react-query";

export default function FullRestInfo() {
  const { state } = useLocation();
  const { restName } = state;

  const {
    data: restInfo,
    isLoading,
    isError,
  } = useQuery(
    ["restaurant", restName],
    () => API.getRestaurantByTitle(restName),
    {
      enabled: Boolean(restName),
      onSuccess: (data) => {
        console.log("Restaurant info fetched successfully:", data);
      },
      onError: (error) => {
        console.error("Error fetching restaurant info:", error);
      },
    }
  );
  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error fetching data</p>;
  }

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
        {restInfo?.tags == null
          ? console.log("no tags")
          : restInfo?.tags.map((item) => {
              return item ? <TopP key={item}>{item} ,</TopP> : null;
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


const MainImage = styled.img`
  width: 100px;
  height: 100px;
  border: 0.5px solid ${COLORS.insideBlue};
`;
