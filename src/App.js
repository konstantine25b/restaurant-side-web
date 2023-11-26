import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";

import Root from "./components/Root";
import MainImage from "./components/pages/MainImage";
import HomePage from "./components/pages/HomePage";
import Categories from "./components/pages/Categories";
import AddCategories from "./components/pages/AddCategories";
import Products from "./components/pages/Products";
import AddProduct from "./components/pages/AddProduct";
import LoginPage from "./components/pages/LoginPage";
import { createContext, useState } from "react";
import CorrectProduct from "./components/pages/CorrectProducts";
import CorrectCategories from "./components/pages/CorrectCategories";
import DetailsPage from "./components/pages/DetailsPage";
import Address from "./components/pages/Address";
import FullRestInfo from "./components/pages/FullRestInfo";
import Description from "./components/pages/Description";
import Tags from "./components/pages/Tags";
import PendingOrders from "./components/pages/PendingOrders";
import ConfirmedOrders from "./components/pages/ConfirmedOrders";
import AllOrders from "./components/pages/AllOrders";
import EachOrderDetails from "./components/pages/EachOrderDetails";
import DeniedOrders from "./components/pages/DeniedOrders";
import DeletedOrders from "./components/pages/DeletedOrders";



export const UserContext = createContext(null);
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route index={true} element={<LoginPage />} />
      <Route path="/HomePage" element={<Root />}>
        <Route index={true} element={<HomePage />} />
        <Route path="/HomePage/MainImage" element={<MainImage />} />
        <Route path="/HomePage/Categories" element={<Categories />} />
        <Route
          path="/HomePage/Categories/AddCategories"
          element={<AddCategories />}
        />
        <Route
          path="/HomePage/Categories/CorrectCategories"
          element={<CorrectCategories />}
        />

        <Route path="/HomePage/Products" element={<Products />} />
        <Route path="/HomePage/Products/AddProduct" element={<AddProduct />} />
        <Route path="/HomePage/Products/Details" element={<DetailsPage />} />
        <Route path="/HomePage/Products/CorrectProduct" element={<CorrectProduct />} />


        <Route path="/HomePage/FullRestInfo" element={<FullRestInfo />} />
        <Route path="/HomePage/Address" element={<Address />} />
        <Route path="/HomePage/Description" element={<Description />} />
        <Route path="/HomePage/RestaurantTags" element={<Tags/>} />

        <Route path="/HomePage/PendingOrders" element={<PendingOrders/>} />
        <Route path="/HomePage/ConfirmedOrders" element={<ConfirmedOrders/>} />
        <Route path="/HomePage/DeniedOrders" element={<DeniedOrders/>} />
        <Route path="/HomePage/DeletedOrders" element={<DeletedOrders/>} />
        <Route path="/HomePage/AllOrders" element={<AllOrders/>} />
        <Route path="/HomePage/EachOrderDetails" element={<EachOrderDetails/>} />

      </Route>
    </Route>
  )
);

function App() {

  const [isLoggedIn, setIsLoggedIn]= useState(false)
  // const[mainUser,setMainUser] = useState(null)
  return (

    // amit anu usercontext provideri gadascems imas shesulia tu ara useri
    // <UserContext.Provider
    //   value={{
    //     isLoggedIn: isLoggedIn,
    //     setIsLoggedIn,
    //     // mainUser: mainUser,
    //     // setMainUser,
    //   }}
    // >
      <RouterProvider router={router} />
    // </UserContext.Provider>
  );
}

export default App;
