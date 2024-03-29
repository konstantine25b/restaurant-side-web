import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import Root from "./components/Root";
import MainImage from "./components/pages/RestInfo/MainImage";
import HomePage from "./components/pages/HomePage";
import Categories from "./components/pages/ProductsCategories/Categories";
import AddCategories from "./components/pages/ProductsCategories/CategoriesComps/AddCategories";
import Products from "./components/pages/ProductsCategories/Products";
import AddProduct from "./components/pages/ProductsCategories/ProductsComps/AddProduct";
import LoginPage from "./components/Authentication/LoginPage";
import CorrectProduct from "./components/pages/ProductsCategories/ProductsComps/CorrectProducts";
import CorrectCategories from "./components/pages/ProductsCategories/CategoriesComps/CorrectCategories";
import DetailsPage from "./components/pages/ProductsCategories/Components/ProductDetailsPage";
import Address from "./components/pages/RestInfo/Address";
import FullRestInfo from "./components/pages/RestInfo/FullRestInfo";
import Description from "./components/pages/RestInfo/Description";
import Tags from "./components/pages/RestInfo/Tags";
import PendingOrders from "./components/pages/Orders/PendingOrders";
import ConfirmedOrders from "./components/pages/Orders/ConfirmedOrders";
import AllOrders from "./components/pages/Orders/AllOrders";
import EachOrderDetails from "./components/pages/Orders/EachOrderDetails";
import DeniedOrders from "./components/pages/Orders/DeniedOrders";
import DeletedOrders from "./components/pages/Orders/DeletedOrders";
import CategoriesDetailsPage from "./components/pages/ProductsCategories/Components/CategoriesDetailsPage";
import { CookiesProvider } from "react-cookie";

const queryClient = new QueryClient();

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route index={true} element={<LoginPage />} />
      <Route path="/HomePage" element={<Root />}>
        <Route index={true} element={<HomePage />} />
        <Route path="/HomePage/MainImage" element={<MainImage />} />
        <Route path="/HomePage/Categories" element={<Categories />} />
        <Route
          path="/HomePage/Categories/Details"
          element={<CategoriesDetailsPage />}
        />
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
        <Route
          path="/HomePage/Products/CorrectProduct"
          element={<CorrectProduct />}
        />

        <Route path="/HomePage/FullRestInfo" element={<FullRestInfo />} />
        <Route path="/HomePage/Address" element={<Address />} />
        <Route path="/HomePage/Description" element={<Description />} />
        <Route path="/HomePage/RestaurantTags" element={<Tags />} />

        <Route path="/HomePage/PendingOrders" element={<PendingOrders />} />
        <Route path="/HomePage/ConfirmedOrders" element={<ConfirmedOrders />} />
        <Route path="/HomePage/DeniedOrders" element={<DeniedOrders />} />
        <Route path="/HomePage/DeletedOrders" element={<DeletedOrders />} />
        <Route path="/HomePage/AllOrders" element={<AllOrders />} />
        <Route
          path="/HomePage/EachOrderDetails"
          element={<EachOrderDetails />}
        />
      </Route>
    </Route>
  )
);

function App() {
  return (
    <CookiesProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </CookiesProvider>
  );
}

export default App;
