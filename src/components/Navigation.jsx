import {Menu} from "antd";
import {useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {getUserMenu} from "../lib/permissions";
import {useMatch, useLocation, useNavigate} from "react-router-dom";


export const Navigation = ()=>{

  const navigate = useNavigate()
  const {pathname} = useLocation()
  const match = useMatch(pathname)

  const {permissions, loading} = useSelector(state=>state.auth)
  const [menuItems, setMenuItems] = useState()
  const [openKeys, setOpenKeys] = useState([]);

  useEffect(() => {
    if (permissions) setMenuItems(getUserMenu(permissions))
  }, [permissions])

  return <Menu
      defaultSelectedKeys={[pathname]}
      defaultOpenKeys={[]}
      mode="inline"
      theme="dark"
      onClick={(e)=>{
        navigate(e.key)
      }}
      items={menuItems}
  />
}