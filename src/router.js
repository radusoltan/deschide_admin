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
import {EditCategory} from "./components/categories/EditCategory";
import {TranslateCategory} from "./components/categories/TranslateCategory";
import {NewCategory} from "./components/categories/NewCategory";
import {CategoryArticles} from "./pages/content/Articles/CategoryArticles";
import {Article} from "./pages/content/Articles/Article";
import {NewAuthor} from "./components/authors/NewAuthor";
import {EditAuthor} from "./components/authors/EditAuthor";
import {TranslateAuthor} from "./components/authors/TranslateAuthor";
import {Cropper} from "./components/images/Cropper";
import {NewCropper} from "./components/images/NewCropper";

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
        path: '/content/authors/new',
        element: <NewAuthor />
      },
      {
        path: '/content/authors/:author/edit',
        element: <EditAuthor />
      },
      {
        path: '/content/authors/:author/translate',
        element: <TranslateAuthor />
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
      },


    ]
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/cropper',
    element: <NewCropper />
  }
])