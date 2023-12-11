import React, { useEffect, useState } from "react";
import { API } from "../../Processing/RestaurantAPI";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import EachPendingOrder from "../pageComponents/EachPendingOrder";

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

export default function AllOrders() {
  const [allOrders, setAllOrders] = useState();
  const { state } = useLocation();
  const { restName, restInfo } = state;
  const navigate = useNavigate();

  let getPendingOrders = async (id) => {
    const orders = await API.getRestaurantOrdersPending(id);
    setAllOrders(orders);
  };

  useEffect(() => {
    getPendingOrders(restInfo?.id);
  }, [restInfo]);
  const [pendingOrders1, setPendingOrders1] = useState([]);

  const orderConfirmation = async (id, orderToConfirm, tableNum) => {

    console.log(1313234)
    if (tableNum <= 0) {
      console.log(23)
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
        const updatedPendingOrders = pendingOrders1.filter(
          (order) => order.id !== id
        );
        setPendingOrders1(updatedPendingOrders);

        // setConfirmedOrders((prevConfirmedOrders) => [
        //   ...prevConfirmedOrders,
        //   orderToConfirm,
        // ]);
      }
       
    }
    else {
      console.log(1313)
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
        const updatedPendingOrders = pendingOrders1.filter(
          (order) => order.id !== id
        );
        setPendingOrders1(updatedPendingOrders);

        // setConfirmedOrders((prevConfirmedOrders) => [
        //   ...prevConfirmedOrders,
        //   orderToConfirm,
        // ]);
      }
    }
  };

  useEffect(() => {
    let pendArr = [];

    for (let i = 0; i < allOrders?.length; i++) {
      let eachOrder = allOrders[i];

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

    setPendingOrders1(pendArr);

    const timer = setInterval(() => {
      pendingOrders1.forEach((order) => {
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
  }, [allOrders]);

  const [remainingTime, setRemainingTime] = useState({
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
      const updatedPendingOrders = pendingOrders1.filter(
        (order) => order.id !== deleteOrderID
      );
      setPendingOrders1(updatedPendingOrders);
    }
  };

  const handleDeleteOrder = (id) => {
    const shouldDelete = window.confirm(
      "Are you sure you want to delete this order?"
    );

    if (shouldDelete) {
      // Perform the deletion
      deleteOrder(id);

      // Update the pending orders list
    }
  };

  const confirmOrder = (id, tableNum) => {
    const orderToConfirm = pendingOrders1.find((order) => order.id === id);

    if (tableNum <= 0) {
      if (orderToConfirm) {
        const confirmConfirmation = window.confirm(
          "Are you sure you want to confirm this order?"
        );

        if (confirmConfirmation) {
          // ese -1 imitoro connfirmaciistvis table number gadavce
          orderConfirmation(id, orderToConfirm, -1);
        }
      }
    } else {
      if (orderToConfirm) {
        const confirmConfirmation = window.confirm(
          "Are you sure you want to confirm this order?"
        );

        if (confirmConfirmation) {
          orderConfirmation(id, orderToConfirm, tableNum);
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
      const updatedPendingOrders = pendingOrders1.filter(
        (order) => order.id !== id
      );
      setPendingOrders1(updatedPendingOrders);
    }
  };
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
  const denyOrder = (id) => {
    const orderToConfirm = pendingOrders1.find((order) => order.id === id);

    if (orderToConfirm) {
      const confirmConfirmation = window.confirm(
        "Are you sure you want to deny this order?"
      );

      if (confirmConfirmation) {
        orderDenying(id, orderToConfirm);
      }
    }
  };

  const sortedPendingOrders =
    groupOrdersByRequestedDate(pendingOrders1)?.reverse();

  return (
    <OrdersContainer>
      <OrderSection orderState={0}>
        <h2 style={{ color: "#FFC100", marginBottom: 100 }}>Pending Orders</h2>
        {sortedPendingOrders.map((order) => {
          return (
            <EachPendingOrder
              key={order.id}
              order={order}
              confirmOrder={confirmOrder}
              denyOrder={denyOrder}
              handleDeleteOrder={handleDeleteOrder}
            />
          );
        })}
      </OrderSection>
    </OrdersContainer>
  );
}
