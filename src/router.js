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
import {EditCategory} from "./pages/content/Categories/EditCategory";
import {TranslateCategory} from "./pages/content/Categories/TranslateCategory";
import {NewCategory} from "./pages/content/Categories/NewCategory";
import {CategoryArticles} from "./pages/content/Articles/CategoryArticles";
import {Article} from "./pages/content/Articles/Article";

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
        path: '/content/categories/:category',
        element: <CategoryArticles />
      },
      {
        path: '/content/categories/new',
        element: <NewCategory />
      },
      {
        path: '/content/categories/:category/edit',
        element: <EditCategory />
      },
      {
        path: '/content/categories/:category/translate',
        element: <TranslateCategory />
      },





      {
        path: '/content/Articles',
        element: <Articles />
      },
      {
        path: '/content/articles/:article',
        element: <Article />
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