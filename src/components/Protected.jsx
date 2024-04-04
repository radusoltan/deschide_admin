import {Outlet} from "react-router-dom";
import {useDispatch} from "react-redux";
import {useGetUserDetailsQuery} from "../services/auth";
import {setCredentials, logout} from "../features/authSlice";
import React, {useEffect, useState} from "react";
import { Layout, Menu, Select, Button, Space, Spin } from 'antd'
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from '@ant-design/icons'
import {HeaderButtons} from "./HeaderButtons";
import {Navigation} from "./Navigation";

export const Protected = () => {
  const { Header, Sider, Content } = Layout
  const dispatch = useDispatch()

  const {data, isSuccess, error, isLoading} = useGetUserDetailsQuery('userDetails', {
    pollingInterval: 100000
  })

  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    if (isSuccess) {
      dispatch(setCredentials(data))
    }
    if (error) {
      dispatch(logout())
    }
  }, [data, dispatch, error]);

  const toggle = () => {
    setCollapsed(!collapsed)
  }

  return <Layout>

    <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        breakpoint="lg"
        style={{
          minHeight: '100vh'
        }}
    >
      <>
        <h1 style={{
          color: 'white',
          padding: '5px'
        }}>DESCHIE.MD | ADMIN</h1>
      </>
      <Navigation/>
    </Sider>

    <Layout className="site-layout">
      <Header className="site-layout-background" style={{ padding: 0 }}>
        {React.createElement(
            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              className: "trigger",
              onClick: toggle,
            }
        )}
        <HeaderButtons />
      </Header>
      <Content>
        <Outlet/>
      </Content>
    </Layout>


  </Layout>
}