import React, { useEffect, useState } from "react";
import { API } from "../../../Processing/RestaurantAPI";
import { useLocation } from "react-router-dom";
import styled from "@emotion/styled";
import EachPendingOrder from "./OrderComponents/EachPendingOrder";
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
  border: 2px solid
    ${(props) =>
      props.orderState == 0
        ? "#FFC100"
        : props.orderState == 1
        ? "#007bff"
        : "red"};
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  padding: 20px;
  background-color: ${(props) =>
    props.orderState ? "#f5f5f5" : "transparent"};
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
const PaginationButton = styled(FancyButton)`
  margin: 0 5px;
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

function calculateTimeLeft(requestedDate) {
  const currentTime = new Date();
  const endTime = new Date(requestedDate);
  const timeDiff = endTime - currentTime;
  const days = Math.floor((timeDiff / (1000 * 60 * 60 * 24)) % 30);
  const hours = Math.floor((timeDiff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((timeDiff / 1000 / 60) % 60);
  const seconds = Math.floor((timeDiff / 1000) % 60);

  return {
    days: days,
    hours: hours,
    minutes: minutes,
    seconds: seconds,
  };
}

const fetchPendingOrders = async (id) => {
  const orders = await API.getRestaurantOrdersPending(id);
  return orders;
};

export default function AllOrders() {
  const { state } = useLocation();
  const { restInfo } = state;

  const [orders, setOrders] = useState();

  const {
    data: pendingOrders,
    isLoading,
    isError,
    refetch,
  } = useQuery(
    ["pendingOrders", restInfo?.id],
    () => fetchPendingOrders(restInfo?.id),
    {
      keepPreviousData: true,
      staleTime: 1000 * 5, // 5 minutes
      // Handle error
      onError: (error) => {
        console.error("Error fetching pending orders:", error);
      },
    }
  );

  // refreshes page when its triggered
  const simulateRealtimeUpdate = () => {
    // Trigger a manual refetch to simulate real-time updates
    refetch();
  };
  const pageSize = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;
  const totalPages = Math.ceil((pendingOrders?.length || 0) / pageSize);

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
  const orderConfirmation = async (id, orderToConfirm, tableNum) => {
    if (tableNum <= 0) {
      console.log(23);
      const confirmOrderSuccess = await API.confirmOrDenyRestaurantOrder(
        id,
        true
      );
      console.log(id, confirmOrderSuccess);
      alert(
        confirmOrderSuccess
          ? "Order confirmed successfully!"
          : "Order confirmation failed."
      );
      if (confirmOrderSuccess) {
        const updatedPendingOrders = orders.filter((order) => order.id !== id);
        setOrders(updatedPendingOrders);
      }
    } else {
      console.log(1313);
      const confirmOrderSuccess = await API.confirmOrDenyRestaurantOrder(
        id,
        true,
        tableNum
      );
      console.log(id, confirmOrderSuccess);
      alert(
        confirmOrderSuccess
          ? "Order confirmed successfully!"
          : "Order confirmation failed."
      );
      if (confirmOrderSuccess) {
        const updatedPendingOrders = orders.filter((order) => order.id !== id);
        setOrders(updatedPendingOrders);
      }
    }
  };

  useEffect(() => {
    let pendArr = [];

    if (pendingOrders) {
      for (let i = 0; i < pendingOrders?.length; i++) {
        let eachOrder = pendingOrders[i];

        let orderItems = [];
        let orderNotes = [];

        for (let j = 0; j < eachOrder.orderItems.length; j++) {
          orderItems.push(eachOrder.orderItems[j].dish_id);
          orderNotes.push(eachOrder.orderItems[j].notes);
        }

        pendArr.push({
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
    setOrders(pendArr);

    const timer = setInterval(() => {
      pendingOrders?.forEach((order) => {
        // Calculate remaining time for each pending order
        const timeLeft = calculateTimeLeft(order.orderRequestedDate);

        // Update the state with the new remaining time
        setRemainingTime(timeLeft);
      });
    }, 1000);

    //  Clean up the timer when the component unmounts
    return () => {
      clearInterval(timer);
    };
  }, [pendingOrders]);

  const [remainingTime, setRemainingTime] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const deleteOrder = async (deleteOrderID) => {
    const deleteOrderSuccess = await API.deleteRestaurantOrder(deleteOrderID);
    alert(
      deleteOrderSuccess
        ? "Order deleted successfully!"
        : "Order deletion failed."
    );
    if (deleteOrderSuccess) {
      const updatedPendingOrders = orders.filter(
        (order) => order.id !== deleteOrderID
      );
      setOrders(updatedPendingOrders);
    }
  };

  const handleDeleteOrder = (id) => {
    const shouldDelete = window.confirm(
      "Are you sure you want to delete this order?"
    );

    if (shouldDelete) {
      // Perform the deletion
      deleteOrder(id).then(() => {
        simulateRealtimeUpdate();
      });

      // Update the pending orders list
    }
  };

  const confirmOrder = (id, tableNum) => {
    const orderToConfirm = orders.find((order) => order.id === id);

    if (tableNum <= 0) {
      if (orderToConfirm) {
        const confirmConfirmation = window.confirm(
          "Are you sure you want to confirm this order?"
        );

        if (confirmConfirmation) {
          // ese -1 imitoro connfirmaciistvis table number gadavce
          orderConfirmation(id, orderToConfirm, -1).then(() => {
            simulateRealtimeUpdate();
          });
        }
      }
    } else {
      if (orderToConfirm) {
        const confirmConfirmation = window.confirm(
          "Are you sure you want to confirm this order?"
        );

        if (confirmConfirmation) {
          orderConfirmation(id, orderToConfirm, tableNum).then(() => {
            simulateRealtimeUpdate();
          });
        }
      }
    }
  };

  const orderDenying = async (id, orderToConfirm) => {
    const confirmOrderSuccess = await API.confirmOrDenyRestaurantOrder(
      id,
      false
    );
    console.log(id, confirmOrderSuccess);
    alert(
      confirmOrderSuccess
        ? "Order denied successfully!"
        : "Order denying failed."
    );
    if (confirmOrderSuccess) {
      const updatedPendingOrders = orders.filter((order) => order.id !== id);
      setOrders(updatedPendingOrders);
    }
  };
  // function groupOrdersByRequestedDate(orders) {
  //   const currentTime = new Date();
  //   const lessThan1Hour = new Date(currentTime);
  //   lessThan1Hour.setHours(currentTime.getHours() - 1);

  //   const pendingOrders = [];
  //   const pastOrders = [];

  //   for (const order of orders) {
  //     const orderDate = new Date(order.orderRequestedDate);

  //     if (orderDate < currentTime) {
  //       pendingOrders.push(order);
  //     } else if (orderDate > lessThan1Hour) {
  //       pendingOrders.push(order);
  //     } else {
  //       pastOrders.push(order);
  //     }
  //   }

  //   return [...pendingOrders, ...pastOrders];
  // }
  const denyOrder = (id) => {
    const orderToConfirm = orders.find((order) => order.id === id);

    if (orderToConfirm) {
      const confirmConfirmation = window.confirm(
        "Are you sure you want to deny this order?"
      );

      if (confirmConfirmation) {
        orderDenying(id, orderToConfirm).then(() => {
          simulateRealtimeUpdate();
        });
      }
    }
  };

  const reversedPendingOrders = [...(orders || [])].reverse();
  const paginatedOrders = reversedPendingOrders.slice(start, end);

  return (
    <OrdersContainer>
      <OrderSection orderState={0}>
        <h2 style={{ color: "#FFC100", marginBottom: 100 }}>Pending Orders</h2>
        {isLoading && <p>Loading...</p>}
        {isError && <p>Error fetching data</p>}
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
        {paginatedOrders.map((order) => (
          <EachPendingOrder
            key={order.id}
            order={order}
            confirmOrder={confirmOrder}
            denyOrder={denyOrder}
            handleDeleteOrder={handleDeleteOrder}
          />
        ))}
      </OrderSection>
    </OrdersContainer>
  );
}
