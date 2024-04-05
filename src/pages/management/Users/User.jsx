import {Button, Card, Form, Input, Select} from "antd";
import { useGetRolesQuery, useGetUserQuery, useUpdateUserMutation} from "../../../services/users";
import {useNavigate, useParams} from "react-router-dom";
import {useEffect} from "react";

export const User = () => {

  const {user} = useParams()
  const navigate = useNavigate()

  const {data, isLoading} = useGetUserQuery(user)
  const {data: roles } = useGetRolesQuery()

  const [updateUser, {isSuccess}] = useUpdateUserMutation()

  useEffect(() => {
    if(isSuccess){
      navigate('/management/users')
    }
  }, [isSuccess, navigate]);

  return <Card title={'User: '+ data?.name} loading={isLoading}>
    <Form
        initialValues={{
          name: data?.name,
          email: data?.email,
          selectedRoles: data?.roles.map(role => role.id)
        }}
        onFinish={(values)=>{
          updateUser({user, body:{...values}})
        }}
    >
      <Form.Item
          name="name"
          label="User Name"
          rules={[
            {required: true}
          ]}
      ><Input /></Form.Item>
      <Form.Item
          name="email"
          label="User Email"
          rules={[
            {required: true},
            { type: 'email' }
          ]}
      ><Input /></Form.Item>
      <Form.Item
          name="selectedRoles"
          label="Select User Role"
      >
        <Select
            mode="multiple"
            options={roles?.map(role=>({
              label: role.name,
              value: role.id
            }))}
        />
      </Form.Item>
      <Form.Item>
        <Button type="success" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  </Card>
}