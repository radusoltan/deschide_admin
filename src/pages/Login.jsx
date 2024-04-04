import {Button, Checkbox, Form, Input} from "antd"
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {userLogin} from "../features/authActions"
import {useEffect} from "react";

export const Login = () => {

  const {loading, error, token} = useSelector(state=>state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const onFinish = (values) => {
    dispatch(userLogin({...values}))
  }

  const onFinishFailed = (errorInfo) => {

  }

  useEffect(() => {
    if (token){
      navigate('/')
    }
  }, [token]);

  return <Form
      name="login-form"
      className="login-form"
      labelCol={{
        span: 8
      }}
      wrapperCol={{
        span: 16
      }}
      initialValues={{
        remember: true
      }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
  >
    <Form.Item
        label="Email"
        name="email"
        rules={[
          {required: true},
          {type: 'email'}
        ]}
    >
      <Input />
    </Form.Item>
    <Form.Item
        label="Password"
        name="password"
        rules={[
          {required: true},
          {type: "string"}
        ]}
    >
      <Input.Password />
    </Form.Item>
    <Form.Item
        name="remember"
        valuePropName="checked"
        wrapperCol={{
          offset: 8,
          span: 16,
        }}
    >
      <Checkbox>Remember me</Checkbox>
    </Form.Item>

    <Form.Item
        wrapperCol={{
          offset: 8,
          span: 16,
        }}
    >
      <Button type="primary" htmlType="submit">
        Submit
      </Button>
    </Form.Item>
  </Form>
}