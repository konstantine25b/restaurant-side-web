import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import styled from "@emotion/styled";
import COLORS from "../themes/colors";
import LeftNavbarList from "./pageComponents/LeftNavbarList";
import { Outlet, useNavigate } from "react-router-dom";
import { UserContext } from "../App";
import {
  getRestaurant,
  getRestaurantAdmin,
  getRestaurantOwner,
  signOut,
  subscribeToLogInEvent,
} from "../Processing/Database";
import { API } from "../Processing/RestaurantAPI";

export default function Root() {
  const navigate = useNavigate();

  // // amit xdeba shesulia tu ara useris shemowmeba
  // const context = useContext(UserContext);

  // restornis axels vwer aq
  const [restName, setRestName] = useState();

  // aq vinaxav restornis mtlian informacia
  const [restInfo, setRestInfo] = useState();

  // es aris localstorageshi shenaxuli data
  const [data, setData] = useState(null);

  const [dataIsUploaded, setDataIsUploaded] = useState(false);

  const handleGetOwnedRestaurant = async () => {
    var result = await API.getOwnedRestaurant();

    if (result) {
      handleGetRestaurantById(result);
    } else {
      console.log("no owned restaurants");
    }
  };
  const handleGetRestaurantById = async (restaurantId) => {
    const restaurantById = await API.getRestaurantById(parseInt(restaurantId));
    setRestName(JSON.parse(JSON.stringify(restaurantById))?.title)
    
    
  };

  // amit tavidanve momaq restornis saxeli
  useLayoutEffect(() => {
    const getRestaurantName = async () => {
      handleGetOwnedRestaurant();
      // setRestName(await getRestaurantAdmin());
    };
    getRestaurantName();
    // aq vsetavt local stoaragedan wamogebul datas
    const savedData = localStorage.getItem("user_email");
    if (savedData) {
      setData(savedData);
      setDataIsUploaded(true);
    }
  }, []);

  // setTimeout(()=>{
  //   if(data!=null){
  //     console.log(data)
  //   }
  // },[3000])

  useEffect(() => {
    if (dataIsUploaded && data == null) {
      setTimeout(() => {
        navigate(`/`);
      }, [500]);
    }
  }, [data, dataIsUploaded]);

  // const getRestaurantInfo = async () => {
  //   setRestInfo(await getRestaurant(restName));
  // };

  // useEffect(() => {
  //   console.log(restName)
  //   // amit saxelis sashualebit momaq restornis info

  //   getRestaurantInfo();

  // }, [restName]);

  // useEffect(()=>{
  //   const handleRefresh = () => {
  //     // Function to be executed on each refresh
  //     console.log('Page has been refreshed');
  //     getRestaurantInfo();

  //   };

  //   handleRefresh(); // Call the function on component mount

  //   const beforeUnloadListener = () => {
  //     handleRefresh(); // Call the function before page refresh
  //   };

  //   window.addEventListener('beforeunload', beforeUnloadListener);

  //   return () => {
  //     window.removeEventListener('beforeunload', beforeUnloadListener);
  //   };

  // },[])

  // console.log(restInfo)

  //tu user gamosvlas daachers mashin mas ushvebs log inshi isev
  // useEffect(() => {
  //   if (!context?.isLoggedIn) {
  //     navigate(`/`);
  //   }
  // }, [context]);

  return (
    <Main>
      <Page>
        <LeftSide>
          <LeftSideTop>
            <CompanyName onClick={() => navigate(`/HomePage`)}>
              Fast Order
            </CompanyName>
          </LeftSideTop>
          <LeftSideList>
            <LeftNavbarList
              title={"Restaurant Info"}
              data={[
                {
                  Title: "Full Restaurant Information",
                  Name: "FullRestInfo",
                  restName: restName,
                },
                {
                  Title: "Address",
                  Name: "Address",
                  restName: restName,
                },
                {
                  Title: "Description",
                  Name: "Description",
                  restName: restName,
                },
                {
                  Title: "Tags",
                  Name: "RestaurantTags",
                  restName: restName,
                },
                {
                  Title: "Restaurant Main Image",
                  Name: "MainImage",
                  restName: restName,
                },
              ]}
            />
            <LeftNavbarList
              title={"Products & Categories"}
              data={[
                {
                  Title: "Products",
                  Name: "Products",
                  restName: restName,
                },
                {
                  Title: "Categories",
                  Name: "Categories",
                  restName: restName,
                },
              ]}
            />
          </LeftSideList>
        </LeftSide>
        <RightSide>
          <UpperSideIn>
            <UserTitle>
              User: {data}
              {/* {context?.mainUser} */}
            </UserTitle>
            <LogOutButton
              onClick={() => {
                // context?.setIsLoggedIn(false);
                localStorage.removeItem("user_email");
                localStorage.removeItem("user_password");
                setData(null);
                // signOut();
              }}
            >
              Log Out
            </LogOutButton>
          </UpperSideIn>
          <OutletSpace>
            <Outlet />
          </OutletSpace>
        </RightSide>
      </Page>
    </Main>
  );
}

const Main = styled.div`
  width: 100%;
`;
const RightSide = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  height: 100%;

  align-items: center;
`;
const UpperSideIn = styled.div`
  width: 100%;
  display: flex;
  height: 40px;
  padding-right: 3%;
  background-color: ${COLORS.light};

  justify-content: right;
  align-items: center;
  position: fixed;
  top: 0;
  border-bottom: 0.4px solid ${COLORS.blue};
  z-index: 1;
`;

const UserTitle = styled.p`
  font-size: 17px;
  margin: 0;
  margin-right: 30px;
`;
const CompanyName = styled.p`
  font-size: 30px;
  color: white;
  margin: 0;
  &:hover {
    cursor: pointer;
  }
`;
const Page = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  height: 100vh;
`;
const LeftSide = styled.div`
  width: 300px;
  height: 100%;
  background-color: ${COLORS.blue};
  position: fixed;
  top: 0;
  z-index: 2;
`;

const LeftSideTop = styled.div`
  width: 100%;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 0.1px solid ${COLORS.light};
`;

const LeftSideList = styled.ul`
  display: flex;
  flex-direction: column;
  max-width: 100%;
  margin: 0;
  padding: 10px 10px;
`;

const OutletSpace = styled.div`
  width: calc(100% - 300px);
  margin-left: 400px;
  margin-top: 80px;
`;

const LogOutButton = styled.div`
  margin: 10px;
  background-color: ${COLORS.insideBlue};
  padding: 5px 10px;
  border-radius: 4px;
  color: white;
  &:hover {
    cursor: pointer;
    opacity: 0.9;
  }
`;
