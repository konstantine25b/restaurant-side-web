import styled from "@emotion/styled";
import React, { useEffect, useState } from "react";
import COLORS from "../../../themes/colors";
import { PlusIcon } from "@heroicons/react/24/solid";
import { useLocation, useNavigate } from "react-router-dom";
import { API } from "../../../Processing/RestaurantAPI";

export default function Categories() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { restName } = state;

  // aq vinaxav restornis mtlian informacia
  const [restInfo, setRestInfo] = useState();

  const getRestaurantInfo = async () => {
    handleGetRestaurantByTitle(restName);
  };
  useEffect(() => {
    console.log(restName);
    // amit saxelis sashualebit momaq restornis info

    getRestaurantInfo();
  }, [restName]);

  const handleGetRestaurantByTitle = async (restaurantTitle) => {
    const restaurantByTitle = await API.getRestaurantByTitle(restaurantTitle);
    setRestInfo(JSON.parse(JSON.stringify(restaurantByTitle)));
  };

  const handleDeleteCategory = async (deleteCategoryID, deleteCategoryName) => {
    const deleteCategorySuccess = await API.deleteCategory(
      deleteCategoryID,
      deleteCategoryName
    );
    alert(
      deleteCategorySuccess
        ? "Category deleted successfully!"
        : "Category deletion failed."
    );
  };

  useEffect(() => {
    const handleRefresh = () => {
      // Function to be executed on each refresh
      console.log("Page has been refreshed");
      getRestaurantInfo();
    };

    handleRefresh(); // Call the function on component mount

    const beforeUnloadListener = () => {
      handleRefresh(); // Call the function before page refresh
    };

    window.addEventListener("beforeunload", beforeUnloadListener);

    return () => {
      window.removeEventListener("beforeunload", beforeUnloadListener);
    };
  }, []);

  const handleDelete = (deleteCategoryID, CategoryName) => {
    // Perform the delete operation here
    // ...

    if (window.confirm("Are you sure you want to delete?")) {
      // Delete confirmed, perform the delete operation
      // ...
      handleDeleteCategory(deleteCategoryID, CategoryName).then(() => {
        window.location.reload(true);
      });
    }
  };

  return (
    <MainDiv>
      <Top>
        <TopP>Categories</TopP>
        <AddButton
          onClick={() =>
            navigate(`/HomePage/Categories/AddCategories`, {
              state: {
                restInfo: restInfo,
                restName: restName,
              },
            })
          }
        >
          <PlusIcon style={{ width: 30, color: "white" }} />
        </AddButton>
      </Top>
      <Bottom>
        <BottomItem>Name (English)</BottomItem>
        <BottomItem>Name (Georgian)</BottomItem>
        <BottomItem>Correction</BottomItem>
        <BottomItem>Delete</BottomItem>
      </Bottom>
      <BottomList>
        {restInfo?.categories?.map((item, index) => {
          return (
            <Bottom1 key={index}>
              <BottomItem1>{item.title}</BottomItem1>
              <BottomItem1>{item.title}</BottomItem1>
              <CorrectionButton
                onClick={() => {
                  navigate(`/HomePage/Categories/CorrectCategories`, {
                    state: {
                      NameEng: item.title,
                      NameGeo: item.title,
                      Image: item.image,
                      categoryInfo: item,
                      restId: restInfo.id,
                    },
                  });
                }}
              >
                Correcting
              </CorrectionButton>
              <DeleteButton onClick={() => handleDelete(item.id, item.title)}>
                Delete
              </DeleteButton>
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
  background-color: ${COLORS.lightBlue};
  border-right: 0.5px solid ${COLORS.insideBlue};
  width: 25%;
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
  width: 25%;
  text-align: center;
  color: white;
  &:hover {
    cursor: pointer;
    opacity: 0.8;
  }
`;
