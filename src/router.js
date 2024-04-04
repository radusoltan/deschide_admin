import {createBrowserRouter} from "react-router-dom"
import {Protected} from "./components/Protected";
import {Login} from "./pages/Login";
import {Dashboard} from "./pages/Dashboard";
import {Categories} from "./pages/content/Categories";
import {Articles} from "./pages/content/Articles";
import {Authors} from "./pages/content/Authors";
import {Users} from "./pages/management/Users";
import {Roles} from "./pages/management/Roles";
import {Permissions} from "./pages/management/Permissions";
import {Lists} from "./pages/content/Lists";
import {User} from "./pages/management/Users/User";
import {Role} from "./pages/management/Roles/Role";

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Protected />,
    children: [
      {
        path: '/',
        element: <Dashboard />
      },
      {
        path: '/content/categories',
        element: <Categories />
      },
      {
        path: '/content/Articles',
        element: <Articles />
      },
      {
        path: '/content/authors',
        element: <Authors />
      },
      {
        path: '/content/lists',
        element: <Lists />
      },
      {
        path: '/management/users',
        element: <Users />
      },
      {
        path: '/management/users/:user',
        element: <User />
      },
      {
        path: '/management/roles',
        element: <Roles />
      },
      {
        path: '/management/roles/:role',
        element: <Role />
      },
      {
        path: '/management/permissions',
        element: <Permissions />
      }
    ]
  },
  {
    path: '/login',
    element: <Login />
  }
])