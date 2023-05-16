import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import styled from "@emotion/styled";
import COLORS from "../themes/colors";
import LeftNavbarList from "./pageComponents/LeftNavbarList";
import { Outlet, useNavigate } from "react-router-dom";
import { UserContext } from "../App";
import { getRestaurant, getRestaurantAdmin, signOut } from "../Processing/Database";


export default function Root() {
  const navigate = useNavigate();

  // amit xdeba shesulia tu ara useris shemowmeba
  const context = useContext(UserContext)

  const[restName , setRestName] = useState()
  const [restInfo , setRestInfo] = useState()
  


  useLayoutEffect(()=>{
    const getRestaurantName = async ()=>{
      setRestName(await getRestaurantAdmin())
    }
    getRestaurantName()
    
    

    
  },[])
  

  useEffect(()=>{
    
    const getRestaurantInfo = async()=>{
      setRestInfo(await getRestaurant(restName))
    }
    getRestaurantInfo()

  },[restName])

  console.log(restInfo)
  

  

  //tu user gamosvlas daachers mashin mas ushvebs log inshi isev
  useEffect(()=>{
    if(!context?.isLoggedIn){
      navigate(`/`)
    }
  },[context])

  return (
    <Main>
      <Page>
        <LeftSide>
          <LeftSideTop>
            <CompanyName onClick={() => navigate(`/HomePage`)}>Fast Order</CompanyName>
          </LeftSideTop>
          <LeftSideList>
            <LeftNavbarList
              title={"Restaurant Info"}
              data={[{Name: "Address"}, {Name: "MainImage"}]}
            />
            <LeftNavbarList
              title={"Products & Categories"}
              data={[{Name:"Products" , restInfo: restInfo}, {Name: "Categories" , restInfo: restInfo}]}
            />
          </LeftSideList>
        </LeftSide>
        <RightSide>
          <UpperSideIn>
            <UserTitle
              onClick={() => {
                context?.setIsLoggedIn(false);
               
                signOut()
              }}
            >
              {context?.mainUser}
            </UserTitle>
          </UpperSideIn>
          <OutletSpace>
            <Outlet/>
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
