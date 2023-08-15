import styled from "@emotion/styled";
import React, { useEffect, useState } from "react";
import COLORS from "../../themes/colors";
import { PlusIcon } from "@heroicons/react/24/solid";
import { useLocation, useNavigate } from "react-router-dom";
import {
  addDish,
  deleteDish,
  getRestaurant,
  updateDish,
} from "../../Processing/Database";

export default function Products() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { restName , restInfo} = state;

  // aq vinaxav restornis mtlian informacia
  

  // const getRestaurantInfo = async () => {
  //   setRestInfo(await getRestaurant(restName));
  // };
  // useEffect(() => {
  //   console.log(restName);
  //   // amit saxelis sashualebit momaq restornis info

  //   getRestaurantInfo();
  // }, [restName]);

  // useEffect(() => {
  //   const handleRefresh = () => {
  //     // Function to be executed on each refresh
  //     console.log("Page has been refreshed");
  //     getRestaurantInfo();
  //   };

  //   handleRefresh(); // Call the function on component mount

  //   const beforeUnloadListener = () => {
  //     handleRefresh(); // Call the function before page refresh
  //   };

  //   window.addEventListener("beforeunload", beforeUnloadListener);

  //   return () => {
  //     window.removeEventListener("beforeunload", beforeUnloadListener);
  //   };
  // }, []);
  useEffect(()=>{
    console.log(restInfo)
  },[restInfo])

  const handleDelete = (Dish, Category) => {
    // Perform the delete operation here
    // ...

    if (window.confirm("Are you sure you want to delete?")) {
      // Delete confirmed, perform the delete operation
      // ...

      deleteDish(Category, Dish).then(() => {
        window.location.reload(true);
      });
    }
  };

  const handleChangeAvaibility = (dish, Category, Avaibility) => {
    // Perform the delete operation here
    // ...

    if (window.confirm("Are you sure you want to change avaibility status?")) {
      // Delete confirmed, perform the delete operation
      // ...

      
        // updateDish(
        //   Category,
        //   dish.title,
        //   dish.title,
        //   dish.description,
        //   dish.image,
        //   dish.approxTime,
        //   dish.ingredients, //Undefined check
        //   dish.price,
        //   Avaibility
        // ).then(()=>{
        //   window.location.reload(true);
        // })
       
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
      <Bottom>
        <BottomItem>Category</BottomItem>
        <BottomItem>Name (English)</BottomItem>
        <BottomItem>Details</BottomItem>
        <BottomItem>Avaibility</BottomItem>
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
                    <Bottom1 key={index + dish.title}>
                      <BottomItem1>{dish.title}</BottomItem1>
                      <CorrectionButton
                        onClick={() => {
                          navigate(`/HomePage/Products/Details`, {
                            state: {
                              restInfo: restInfo,
                              categoryIndex: index1,
                              dishIndex: index,
                            },
                          });
                        }}
                      >
                        See full details
                      </CorrectionButton>
                      {dish.Availability ? (
                        <BottomItemAvaible1
                          onClick={() =>
                            handleChangeAvaibility(dish, item.Title, false)
                          }
                        >
                          Avaible
                        </BottomItemAvaible1>
                      ) : (
                        <BottomItemAvaible2
                          onClick={() =>
                            handleChangeAvaibility(dish, item.Title, true)
                          }
                        >
                          Not Avaible
                        </BottomItemAvaible2>
                      )}

                      <CorrectionButton
                        onClick={() => {
                          navigate(`/HomePage/Products/CorrectProduct`, {
                            state: {
                              restInfo: restInfo,
                              categoryIndex: index1,
                              dishIndex: index,
                              Img: dish.Image,
                            },
                          });
                        }}
                      >
                        Correcting
                      </CorrectionButton>
                      <DeleteButton
                        onClick={() => handleDelete(dish.Title, item.Title)}
                      >
                        Delete
                      </DeleteButton>
                    </Bottom1>
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
const BottomItem1 = styled.li`
  all: unset;
  padding: 15px;
  box-sizing: border-box !important;
  border-right: 0.5px solid ${COLORS.insideBlue};
  width: calc(100% / 5) !important;
`;

const BottomItemAvaible1 = styled.li`
  all: unset;
  padding: 15px;
  box-sizing: border-box !important;
  border-right: 0.5px solid ${COLORS.insideBlue};
  width: calc(100% / 5) !important;
  background-color: ${COLORS.green};
  color: ${COLORS.lightBlue};
  &:hover {
    cursor: pointer;
    opacity: 0.8;
  }
`;

const BottomItemAvaible2 = styled.li`
  all: unset;
  padding: 15px;
  box-sizing: border-box !important;
  border-right: 0.5px solid ${COLORS.insideBlue};
  width: calc(100% / 5) !important;
  background-color: ${COLORS.iconColor};
  color: white;
  &:hover {
    cursor: pointer;
    opacity: 0.8;
  }
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

const CorrectionButton = styled.li`
  all: unset;
  height: 100% !important;
  padding: 15px;
  background-color: ${COLORS.lightBlue};
  border-right: 0.5px solid ${COLORS.insideBlue};
  width: calc(100% / 6);
  text-align: center;
  color: white;
  &:hover {
    cursor: pointer;
    opacity: 0.8;
  }
`;
const DeleteButton = styled.li`
  all: unset;
  padding: 15px;
  background-color: ${COLORS.red};
  border-right: 0.5px solid ${COLORS.insideBlue};
  width: calc(100% / 6);
  text-align: center;
  color: white;
  &:hover {
    cursor: pointer;
    opacity: 0.8;
  }
`;
