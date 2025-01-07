import './App.css';
import { RouterProvider} from "react-router-dom";
import React from "react";
import AppRoutes from "./router";


function App() {
  return (
      <RouterProvider router={AppRoutes}/>
  );
}

export default App;
