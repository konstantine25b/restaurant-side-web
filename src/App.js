
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import HomePage from './components/HomePage';


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path = '/'>
       <Route index={true} element={<HomePage/>}/>
      
    </Route>
    

    
  )
)

function App() {
  return (
    <RouterProvider router = {router}/>
    
  );
}



export default App;
