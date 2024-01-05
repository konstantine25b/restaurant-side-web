import React, { useEffect, useState } from "react";
import { API } from "../../../Processing/RestaurantAPI";
import { useLocation } from "react-router-dom";
import styled from "@emotion/styled";
import ConfOrderItems from "./OrderComponents/ConfOrderItems";
import { useQuery } from "react-query";
import Select from "react-select";

const OrdersContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const OrderSection = styled.div`
  width: 85%;
  margin: 20px 0;
  margin-left: -8%;
  border: 2px solid ${(props) => (props.orderState === 3 ? "gray" : "grey")};
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  padding: 20px;
  background-color: ${(props) =>
    props.orderState === 3 ? "transparent" : "grey"};
  transition: transform 0.2s;
  cursor: pointer;
`;

const PageNavigation = styled.div`
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
`;

const FancyButton = styled.button`
  padding: 15px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;
const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
`;

const PageSelectContainer = styled.div`
  display: flex;
  align-items: center;
`;
const PaginationButton = styled(FancyButton)`
  margin: 0 5px;
`;

function calculateTimeLeft(requestedDate) {
  const currentTime = new Date();
  const endTime = new Date(requestedDate);
  const timeDiff = endTime - currentTime;
  const hours = Math.floor((timeDiff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((timeDiff / 1000 / 60) % 60);
  const seconds = Math.floor((timeDiff / 1000) % 60);

  return {
    hours: hours,
    minutes: minutes,
    seconds: seconds,
  };
}

const fetchDeletedOrders = async (id) => {
  const orders = await API.getRestaurantOrdersDeleted(id);
  return orders;
};

export default function DeletedOrders() {
  const { state } = useLocation();
  const { restInfo } = state;

  const [orders, setOrders] = useState();

  const {
    data: deletedOrders,
    isLoading,
    isError,
  } = useQuery(
    ["deletedOrders", restInfo?.id],
    () => fetchDeletedOrders(restInfo?.id),
    {
      keepPreviousData: true,
      staleTime: 1000 * 5, // 5 minutes
      // Handle error
      onError: (error) => {
        console.error("Error fetching deleted orders:", error);
      },
    }
  );

  const pageSize = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;
  const totalPages = Math.ceil((deletedOrders?.length || 0) / pageSize);

  const handlePageClick = (selectedOption) => {
    setCurrentPage(selectedOption.value);
  };
  const options = Array.from({ length: totalPages }, (_, index) => ({
    value: index + 1,
    label: `${index + 1}`,
  }));
  // es aris Select is style
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: "#007bff",
      color: "white",
      borderRadius: "5px",
      border: "none",
      boxShadow: state.isFocused ? "0 0 0 1px #0056b3" : "none",
      "&:hover": {
        borderColor: state.isFocused ? "#0056b3" : "none",
      },
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? "#0056b3" : "#007bff",
      color: "white",
      "&:hover": {
        backgroundColor: state.isSelected ? "#0056b3" : "#0056b3",
      },
    }),
    indicatorSeparator: (provided) => ({
      ...provided,
      display: "none",
    }),
  };

  const [remainingTime, setRemainingTime] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    let confArr = [];

    if (deletedOrders) {
      for (let i = 0; i < deletedOrders?.length; i++) {
        let eachOrder = deletedOrders[i];

        let orderItems = [];
        let orderNotes = [];

        for (let j = 0; j < eachOrder.orderItems.length; j++) {
          orderItems.push(eachOrder.orderItems[j].dish_id);
          orderNotes.push(eachOrder.orderItems[j].notes);
        }

        confArr.push({
          id: eachOrder.id,
          orderRequestedDate: eachOrder.orderRequestedDate,
          orderSent: eachOrder.orderSent,
          totalPrice: eachOrder.totalPrice,
          userId: eachOrder.userId,
          orderState: eachOrder.orderState,
          orderItems: orderItems,
          itemNotes: orderNotes,
          orderTable: eachOrder.orderTable,
        });
      }
    }
    setOrders(confArr);

    const timer = setInterval(() => {
      deletedOrders?.forEach((order) => {
        // Calculate remaining time for each pending order
        const timeLeft = calculateTimeLeft(order.orderRequestedDate);

        // Update the state with the new remaining time
        setRemainingTime(timeLeft);
      });
    }, 1000);

    // Clean up the timer when the component unmounts
    return () => {
      clearInterval(timer);
    };
  }, [deletedOrders]);

  const reversedDeletedOrders = [...(orders || [])].reverse();
  const paginatedOrders = reversedDeletedOrders.slice(start, end);

  return (
    <OrdersContainer>
      <OrderSection orderState={3}>
        <h2 style={{ color: "grey", marginBottom: 20 }}>Deleted Orders</h2>
        <PageNavigation>
          <PaginationContainer>
            <PaginationButton
              onClick={() => handlePageClick({ value: currentPage - 1 })}
              disabled={currentPage === 1 || isLoading}
            >
              Previous
            </PaginationButton>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <PaginationButton
              onClick={() => handlePageClick({ value: currentPage + 1 })}
              disabled={currentPage === totalPages || isLoading}
            >
              Next
            </PaginationButton>
          </PaginationContainer>
          <PageSelectContainer>
            <Select
              value={{ value: currentPage, label: `${currentPage}` }}
              onChange={handlePageClick}
              options={options}
              styles={customStyles}
            />
          </PageSelectContainer>
        </PageNavigation>
        {isLoading && <p>Loading...</p>}
        {isError && <p>Error fetching data</p>}
        {paginatedOrders.map((order) => (
          <ConfOrderItems key={order.id} props={order} />
        ))}
      </OrderSection>
    </OrdersContainer>
  );
}
