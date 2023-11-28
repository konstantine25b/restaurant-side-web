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

const OrderItem = styled.div`
  margin-bottom: 30px;
  font-size: 18px;
  border: 1px solid ${(props) => (props.isTimePassed ? "red" : "#ccc")};
  padding: 10px;
  border-radius: 5px;
  transition: transform 0.2s;
  background-color: ${(props) =>
    props.isTimeWarning
      ? props.isTimePassed
        ? "red"
        : "#FFFF99"
      : props.isTimePassed
      ? "#ff9999"
      : "transparent"};

  &:hover {
    transform: scale(1.02);
  }
`;
// const ConfirmButton = styled.button`
//   background-color: #007bff;
//   color: #fff;
//   padding: 10px 20px;
//   border: none;
//   border-radius: 5px;
//   font-size: 16px;
//   cursor: pointer;
//   transition: background-color 0.2s;

//   &:hover {
//     background-color: #0056b3;
//   }
// `;

const FancyInputContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const TableInput = styled.input`
  padding: 10px;
  font-size: 14px;
  border-radius: 5px;
  margin-right: 10px;
  border: 1px solid #ccc;
`;

const FancyInputLabel = styled.label`
  background-color: #007bff;
  color: #fff;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #0056b3;
  }
`;
const ConfirmButton = styled.button`
  background-color: #007bff;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: background-color 0.2s;

  &:hover {
    background-color: ${(props) => (props.disabled ? "#007bff" : "#0056b3")};
  }
`;

const OrderDetails = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const OrderField = styled.div`
  flex: ${(props) => (props.orderState ? "2" : "1")};
`;

const TotalPrice = styled.div`
  font-size: 18px;
  font-weight: bold;
  padding: 5px;
  margin-top: 10px;
`;

const UserId = styled.div`
  font-size: 16px;
  padding: 5px;
  margin-top: 5px;
  margin-bottom: 15px;
`;
const DeleteButton = styled.button`
  background-color: black; /* Red color */
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  margin-left: 20px;
  margin-top: 10px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    opacity: 0.8; /* Darker red on hover */
  }
`;
const DenyButton = styled.button`
  background-color: red;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  margin-left: 20px;
  transition: background-color 0.2s;

  &:hover {
    background-color: darkred;
  }
`;

const SeeDetailsButton = styled.button`
  background-color: white;
  color: #007bff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 10px;
  margin-bottom: 10px;
  margin-right: 20px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #0056b3;
    color: white;
  }
`;

const TimeWarning = styled.div`
  color: ${(props) =>
    props.isTimePassed ? "red" : props.isTimeWarning ? "orange" : "inherit"};
  font-size: 14px;
  margin-top: 5px;
`;

function isTimePassed(requestedDate) {
  const currentTime = new Date();
  return currentTime > new Date(requestedDate);
}

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
// {sortedPendingOrders.map((order) => {
//   let tableNumber = -1;

//   const handleTableChange = (e) => {

//     tableNumber = e.target.value;

//     console.log( tableNumber)
//   };

//   const handleConfirmClick = () => {
//     console.log(order.orderTable,tableNumber)
//     if (order.orderTable <= 0 && tableNumber > 0) {
//       console.log(1)
//       confirmOrder(order.id, tableNumber);
//     } else if (order.orderTable > 0) {
//       confirmOrder(order.id , -1);// ese imito rom table ro gadavcem chaiweros
//     }
//     else{
//       alert("Please choose a table number");
//     }
//   };
//   return (
//     <div key={order.id}>
//       <OrderItem
//         isTimeWarning={
//           calculateTimeLeft(order.orderRequestedDate).hours === 0 &&
//           calculateTimeLeft(order.orderRequestedDate).minutes <= 45
//         }
//         isTimePassed={isTimePassed(order.orderRequestedDate)}
//       >
//         <OrderDetails>
//           <OrderField orderState={0}>
//             <strong>Order ID:</strong> {order.id}
//           </OrderField>
//           <OrderField orderState={0}>
//             <strong>Order Request Date:</strong>{" "}
//             {new Date(order.orderRequestedDate).toLocaleString()}
//           </OrderField>
//           <OrderField orderState={0}>
//             <strong>Order Sent Date:</strong>{" "}
//             {order.orderSent
//               ? new Date(order.orderSent).toLocaleString()
//               : ""}
//           </OrderField>
//           <TimeWarning
//             isTimeWarning={
//               calculateTimeLeft(order.orderRequestedDate).hours === 0 &&
//               calculateTimeLeft(order.orderRequestedDate).minutes <= 60
//             }
//             isTimePassed={isTimePassed(order.orderRequestedDate)}
//           >
//             {isTimePassed(order.orderRequestedDate)
//               ? "Time has passed"
//               : `Time left: ${
//                   calculateTimeLeft(order.orderRequestedDate).hours
//                 }h ${
//                   calculateTimeLeft(order.orderRequestedDate).minutes
//                 }m ${
//                   calculateTimeLeft(order.orderRequestedDate).seconds
//                 }s`}
//           </TimeWarning>
//         </OrderDetails>
//         {/* <OrderItemContainer>
//         {order.orderItems.map((item, index) => (
//           <OrderItemDetails key={index}>
//             <strong>Item {index + 1}:</strong> {item}
//             <OrderItemNote>
//               <strong>Notes:</strong> {order.itemNotes[index]}
//             </OrderItemNote>
//           </OrderItemDetails>
//         ))}
//       </OrderItemContainer> */}
//         <TotalPrice>
//           <strong>Table ID:</strong>{" "}
//           {order.orderTable > 0 ? order.orderTable : "None"}
//         </TotalPrice>
//         <TotalPrice>
//           <strong>Total Price:</strong> ₾{order.totalPrice.toFixed(2)}
//         </TotalPrice>
//         <UserId>
//           <strong>Customer ID:</strong> {order.userId}
//         </UserId>
//         <OrderField orderState={0}>
//           {!order.orderState && (
//             <>
//               <SeeDetailsButton
//                 onClick={() => {
//                   navigate("/HomePage/EachOrderDetails", {
//                     state: {
//                       orderItems: order.orderItems,
//                       totalPrice: order.totalPrice?.toFixed(2),
//                       userId: order?.userId,
//                       orderNotes: order.itemNotes,
//                       orderRequestedDate: order.orderRequestedDate,
//                       orderSent: new Date(
//                         order.orderSent
//                       ).toLocaleString(),
//                       orderTable: order?.orderTable,
//                     },
//                   });
//                 }}
//               >
//                 See Details
//               </SeeDetailsButton>
//               {order.orderTable <= 0 ? (
//                   <TableInput
//                     type="number"
//                     placeholder="Enter Table Number"
//                     onChange={(e) => handleTableChange(e)}
//                     min="1" // Set the minimum allowed value
//                     step="1"
//                   />

//               ) : null}

//               <ConfirmButton

//                 onClick={handleConfirmClick}
//               >
//                 Confirm Order
//               </ConfirmButton>
//               <DenyButton onClick={() => denyOrder(order.id)}>
//                 Deny Order
//               </DenyButton>
//               <DeleteButton onClick={() => handleDeleteOrder(order.id)}>
//                 Delete Order
//               </DeleteButton>
//             </>
//           )}
//         </OrderField>
//       </OrderItem>
//     </div>
//   );
// })}
