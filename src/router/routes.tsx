import Home from "@/pages/home";
import ErrorPage from "@/pages/error-page";

export default [
  {
    path: "/",
    element: <Home />,
    errorElement: <ErrorPage />,
    children: [{
      path: '/list/:listId',
      element: <Home />,
    }]
  },
]