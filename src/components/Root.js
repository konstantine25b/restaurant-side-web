import React, { useEffect } from "react";
import styled from "@emotion/styled";
import COLORS from "../themes/colors";
import LeftNavbarList from "./pages/pageComponents/LeftNavbarList";
import { Outlet, useNavigate } from "react-router-dom";
import { API } from "../Processing/RestaurantAPI";
import { useQuery } from "react-query";
import { useCookies } from "react-cookie";

export default function Root() {
  const navigate = useNavigate();
  const [cookies, , removeCookie] = useCookies(["user"]);

  useEffect(() => {
    if (!cookies.user) {
      navigate("/");
    }
  }, [cookies, navigate]);

  const { data: restInfo } = useQuery(
    ["restInfo"],
    () => handleGetOwnedRestaurant(),
    {
      keepPreviousData: true,
      staleTime: 1000 * 5, // 5 secs
      // Handle error
      onError: (error) => {
        console.error("Error fetching confirmed orders:", error);
      },
    }
  );

  const handleGetOwnedRestaurant = async () => {
    let result = await API.getOwnedRestaurant();

    if (result) {
      const restaurantById = await API.getRestaurantById(parseInt(result));
      return JSON.parse(JSON.stringify(restaurantById));
    } else {
      console.log("no owned restaurants");
      return null;
    }
  };

  return (
    <Main>
      {cookies.user ? (
        <Page>
          <LeftSide>
            <LeftSideTop>
              <CompanyName onClick={() => navigate(`/HomePage`)}>
                Presto Reserve
              </CompanyName>
            </LeftSideTop>
            <LeftSideList>
              <LeftNavbarList
                title={"Restaurant Info"}
                data={[
                  {
                    Title: "Full Restaurant Information",
                    Name: "FullRestInfo",
                    restName: restInfo?.title,
                  },
                  {
                    Title: "Address",
                    Name: "Address",
                    restName: restInfo?.title,
                  },
                  {
                    Title: "Description",
                    Name: "Description",
                    restName: restInfo?.title,
                  },
                  {
                    Title: "Tags",
                    Name: "RestaurantTags",
                    restName: restInfo?.title,
                  },
                  {
                    Title: "Restaurant Main Image",
                    Name: "MainImage",
                    restName: restInfo?.title,
                  },
                ]}
              />
              <LeftNavbarList
                title={"Products & Categories"}
                data={[
                  {
                    Title: "Products",
                    Name: "Products",
                    restName: restInfo?.title,
                    restInfo: restInfo,
                  },
                  {
                    Title: "Categories",
                    Name: "Categories",
                    restName: restInfo?.title,
                  },
                ]}
              />
              <LeftNavbarList
                title={"Orders"}
                data={[
                  {
                    Title: "All Orders",
                    Name: "AllOrders",
                    restName: restInfo?.title,
                    restInfo: restInfo,
                  },
                  {
                    Title: "Pending Orders",
                    Name: "PendingOrders",
                    restName: restInfo?.title,
                    restInfo: restInfo,
                  },
                  {
                    Title: "Confirmed Orders",
                    Name: "ConfirmedOrders",
                    restName: restInfo?.title,
                    restInfo: restInfo,
                  },
                  {
                    Title: "Denied Orders",
                    Name: "DeniedOrders",
                    restName: restInfo?.title,
                    restInfo: restInfo,
                  },
                  {
                    Title: "Deleted Orders",
                    Name: "DeletedOrders",
                    restName: restInfo?.title,
                    restInfo: restInfo,
                  },
                ]}
              />
            </LeftSideList>
          </LeftSide>
          <RightSide>
            <UpperSideIn>
              <UserTitle>User: {cookies.user || "No user logged in"}</UserTitle>
              <LogOutButton
                onClick={() => {
                  removeCookie("user", { path: "/" });
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
      ) : null}
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
