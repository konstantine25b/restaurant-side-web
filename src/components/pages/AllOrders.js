import React, { useEffect, useState } from "react";
import { API } from "../../Processing/RestaurantAPI";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import EachPendingOrder from "../pageComponents/EachPendingOrder";
import ConfOrderItems from "../pageComponents/ConfOrderItems";
import { useQuery } from "react-query";

const OrdersContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const AllOrdersTitle = styled.h1`
  font-size: 34px;
  color: #007bff; /* Blue color */
  text-align: center;
  margin-bottom: 20px;
  text-transform: uppercase;
  letter-spacing: 2px;
  /* Add any other styling you desire */
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

const fetchOrders = async (id) => {
  const orders = await API.getRestaurantOrders(id);
  return orders;
};

export default function AllOrders() {
  const [allOrders, setAllOrders] = useState();
  const { state } = useLocation();
  const { restName, restInfo } = state;

  const {
    data: orders,
    isLoading,
    isError,
    refetch,
  } = useQuery(["orders", restInfo?.id], () => fetchOrders(restInfo?.id), {
    keepPreviousData: true,
    staleTime: 1000 * 5, // 5 minutes
    // Handle error
    onError: (error) => {
      console.error("Error fetching  orders:", error);
    },
  });

  // refreshes page when its triggered
  const simulateRealtimeUpdate = () => {
    // Trigger a manual refetch to simulate real-time updates
    refetch();
  };

  const pageSize = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;

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
        const updatedPendingOrders = pendingOrders.filter(
          (order) => order.id !== id
        );
        setPendingOrders(updatedPendingOrders);
      }
    } else {
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
        const updatedPendingOrders = pendingOrders.filter(
          (order) => order.id !== id
        );
        setPendingOrders(updatedPendingOrders);
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
      const updatedPendingOrders = pendingOrders.filter(
        (order) => order.id !== id
      );
      setPendingOrders(updatedPendingOrders);

      setDeniedOrders((prevConfirmedOrders) => [
        ...prevConfirmedOrders,
        orderToConfirm,
      ]);
    }
  };

  const [pendingOrders, setPendingOrders] = useState([]);
  const [confirmedOrders, setConfirmedOrders] = useState([]);
  const [deniedOrders, setDeniedOrders] = useState([]);



  useEffect(() => {
    let confArr = [];
    let pendArr = [];
    let denArr = [];

    for (let i = 0; i < orders?.length; i++) {
      let eachOrder = orders[i];
      if (eachOrder.orderState === 0) {
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
      } else if (eachOrder.orderState === 1) {
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
      } else {
        let orderItems = [];
        let orderNotes = [];

        for (let j = 0; j < eachOrder.orderItems.length; j++) {
          orderItems.push(eachOrder.orderItems[j].dish_id);
          orderNotes.push(eachOrder.orderItems[j].notes);
        }

        denArr.push({
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

    setConfirmedOrders(confArr);
    setPendingOrders(pendArr);
    setDeniedOrders(denArr);

    const timer = setInterval(() => {
      pendingOrders.forEach((order) => {
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
  }, [orders]);

  const [remainingTime, setRemainingTime] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // amit vajgufeb orderebs romeli unda iyos pirveli dabolo
  function groupOrdersByRequestedDate(orders) {
    const currentTime = new Date();
    const lessThan1Hour = new Date(currentTime);
    lessThan1Hour.setHours(currentTime.getHours() - 1);

    const pendingOrders = [];
    const pastOrders = [];

    for (const order of orders) {
      const orderDate = new Date(order.orderRequestedDate);

      if (orderDate < currentTime) {
        pendingOrders.push(order);
      } else if (orderDate > lessThan1Hour) {
        pendingOrders.push(order);
      } else {
        pastOrders.push(order);
      }
    }

    return [...pendingOrders, ...pastOrders];
  }

  const sortedPendingOrders =
    groupOrdersByRequestedDate(pendingOrders)?.reverse();
  const sortedConfirmedOrders =
    groupOrdersByRequestedDate(confirmedOrders)?.reverse();
  const sortedDeniedOrders =
    groupOrdersByRequestedDate(deniedOrders)?.reverse();

  const deleteOrder = async (deleteOrderID) => {
    const deleteOrderSuccess = await API.deleteRestaurantOrder(deleteOrderID);
    alert(
      deleteOrderSuccess
        ? "Order deleted successfully!"
        : "Order deletion failed."
    );
    if (deleteOrderSuccess) {
      const updatedPendingOrders = pendingOrders.filter(
        (order) => order.id !== deleteOrderID
      );
      setPendingOrders(updatedPendingOrders);
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
    const orderToConfirm = pendingOrders.find((order) => order.id === id);

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
  const denyOrder = (id) => {
    const orderToConfirm = pendingOrders.find((order) => order.id === id);

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

  const paginatedPendingOrders = sortedPendingOrders.slice(start, end);
  const paginatedConfirmedOrders = sortedConfirmedOrders.slice(start, end);
  const paginatedDeniedOrders = sortedDeniedOrders.slice(start, end);

  return (
    <OrdersContainer>
      <AllOrdersTitle>All Orders</AllOrdersTitle>
      <OrderSection orderState={0}>
        <h2 style={{ color: "#FFC100", marginBottom: 100 }}>Pending Orders</h2>
        {isLoading && <p>Loading...</p>}
        {isError && <p>Error fetching data</p>}
        <PageNavigation>
          <FancyButton
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1 || isLoading}
          >
            Previous Page
          </FancyButton>
          <FancyButton
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={end >= pendingOrders?.length || isLoading}
          >
            Next Page
          </FancyButton>
        </PageNavigation>
        {paginatedPendingOrders.map((order) => (
          <EachPendingOrder
            key={order.id}
            order={order}
            confirmOrder={confirmOrder}
            denyOrder={denyOrder}
            handleDeleteOrder={handleDeleteOrder}
          />
        ))}
      </OrderSection>

      <OrderSection orderState={1}>
        <h2 style={{ color: "#007bff", marginBottom: 20 }}>Confirmed Orders</h2>
        {isLoading && <p>Loading...</p>}
        {isError && <p>Error fetching data</p>}
        <PageNavigation>
          <FancyButton
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1 || isLoading}
          >
            Previous Page
          </FancyButton>
          <FancyButton
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={end >= confirmedOrders?.length || isLoading}
          >
            Next Page
          </FancyButton>
        </PageNavigation>
        {paginatedConfirmedOrders.map((order) => (
          <ConfOrderItems key={order.id} props={order} />
        ))}
      </OrderSection>

      <OrderSection orderState={2}>
        <h2 style={{ color: "red", marginBottom: 20 }}>Denied Orders</h2>
        <PageNavigation>
          <FancyButton
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous Page
          </FancyButton>
          <FancyButton
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={end >= deniedOrders?.length}
          >
            Next Page
          </FancyButton>
        </PageNavigation>
        {isLoading && <p>Loading...</p>}
        {isError && <p>Error fetching data</p>}
        {paginatedDeniedOrders.map((order) => (
          <ConfOrderItems key={order.id} props={order} />
        ))}
      </OrderSection>
    </OrdersContainer>
  );
}
