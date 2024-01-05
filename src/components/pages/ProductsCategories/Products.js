import styled from "@emotion/styled";
import React from "react";
import COLORS from "../../../themes/colors";
import { PlusIcon } from "@heroicons/react/24/solid";
import { useLocation, useNavigate } from "react-router-dom";
import { API } from "../../../Processing/RestaurantAPI";
import { useQuery } from "react-query";
import ProductsComps from "./ProductsComps/ProductsComps";

const handleGetRestaurantByTitle = async (restaurantTitle) => {
  const restaurantByTitle = await API.getRestaurantByTitle(restaurantTitle);
  return JSON.parse(JSON.stringify(restaurantByTitle));
};
export default function Products() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { restName } = state;

  const {
    data: restInfo,
    isLoading,
    isError,
  } = useQuery(
    ["restIndo", restName],
    () => handleGetRestaurantByTitle(restName),
    {
      keepPreviousData: true,
      staleTime: 1000 * 5, // 5 secs
      // Handle error
      onError: (error) => {
        console.error("Error fetching confirmed orders:", error);
      },
    }
  );

  const handleUpdateDish = async (
    updateDishID,
    updateDishTitle,
    updateDishPrice,
    uploadLink,
    approxtime,
    description,
    ingredients,
    categoryId,
    available
  ) => {
    const updateDishData = {
      title: updateDishTitle,
      price: parseInt(updateDishPrice),
      image: uploadLink,
      approxtime: approxtime,
      description: description,
      ingredients: ingredients,
      categoryId: categoryId,
      available: available,
    };

    console.log(updateDishID, updateDishData);
    const updateDishSuccess = await API.updateDish(
      updateDishID,
      updateDishData
    );
    alert(
      updateDishSuccess ? "Dish updated successfully!" : "Dish update failed."
    );
  };

  const handleChangeAvaibility = (dish, Category, Avaibility) => {
    if (
      window.confirm("Are you sure you want to change availability status?")
    ) {
      console.log(dish, Category, Avaibility);
      handleUpdateDish(
        dish.id,
        dish.title,
        dish.price,
        dish.image,
        dish.approxtime,
        dish.description,
        dish.ingredients !== undefined ? dish.ingredients : [], //Undefined check
        dish.categoryId,
        Avaibility
      ).then(() => {
        window.location.reload(true);
      });
    }
  };

  return (
    <MainDiv>
      <Top>
        <TopP>Products</TopP>
        <AddButton
          onClick={() =>
            navigate(`/HomePage/Products/AddProduct`, {
              state: {
                restInfo: restInfo,
              },
            })
          }
        >
          <PlusIcon style={{ width: 30, color: "white" }} />
        </AddButton>
      </Top>
      {isLoading && <p>Loading...</p>}
      {isError && <p>Error fetching data</p>}
      <Bottom>
        <BottomItem>Category</BottomItem>
        <BottomItem>Name (English)</BottomItem>
        <BottomItem>Details</BottomItem>
        <BottomItem>Availability</BottomItem>
        <BottomItem>Correction</BottomItem>
        <BottomItem>Delete</BottomItem>
      </Bottom>
      <BottomList>
        {restInfo?.categories?.map((item, index1) => {
          return (
            <Bottom2 key={index1}>
              <BottomItem2 key={index1}>{item.title}</BottomItem2>
              <Bottom3>
                {item.dishes.map((dish, index) => {
                  // console.log(dish.title , item.title)
                  // console.log(index * 10 + index1 + dish.Title);
                  return (
                    <ProductsComps
                      restInfo={restInfo}
                      index1={index1}
                      index={index}
                      handleChangeAvaibility={handleChangeAvaibility}
                      dish={dish}
                      item={item}
                    />
                  );
                })}
              </Bottom3>
            </Bottom2>
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
  margin-bottom: 100px;
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
  color: white;
`;
const BottomItem = styled.li`
  all: unset;
  padding: 15px;
  border-right: 0.5px solid ${COLORS.insideBlue};
  width: calc(100% / 6);
`;
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
  width: calc(100% * 5 / 6) !important;
  margin: 0px;
  padding: 0px;

  background-color: ${COLORS.light};
  border: 0.5px solid ${COLORS.insideBlue};
`;

const BottomItem2 = styled.li`
  all: unset;
  padding: 15px;
  box-sizing: border-box !important;
  border-right: 0.5px solid ${COLORS.insideBlue};
  width: calc(100% / 6) !important;
`;
const BottomList = styled.ul`
  width: 100%;
  margin: 0;
  padding: 0;
`;
