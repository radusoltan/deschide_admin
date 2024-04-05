import {Button, Card, Form, Input, Checkbox} from "antd";
import {useGetPermissionsQuery, useGetRoleQuery, useUpdateRoleMutation} from "../../../services/users";
import {useNavigate, useParams} from "react-router-dom";
import {useEffect} from "react";

export const Role = ()=>{
  const {role} = useParams()
  const {data, isLoading} = useGetRoleQuery(role)
  const {data: permissions} = useGetPermissionsQuery()
  const [updateRole, {isSuccess}] = useUpdateRoleMutation()
  const navigate = useNavigate()

  useEffect(() => {
    if(isSuccess){
      navigate("/management/roles")
    }
  }, [isSuccess, navigate]);

  return <Card title={`Role: ${data?.name}`} loading={isLoading}>
    <Form
        layout="vertical"
        initialValues={{
          name: data?.name,
          permissions: data?.permissions.map(per => per.id)
        }}
        onFinish={(values)=>{
          updateRole({role,body:{...values}})
        }}
    >
      <Form.Item
          name="name"
          label="Role Name"
          rules={[
            {required: true}
          ]}
      ><Input /></Form.Item>
      <Form.Item name="permissions" label="Check Permissions">
        <Checkbox.Group
            options={permissions?.map(permission=>({
              label: permission.name,
              value: permission.id
            }))}
        />
      </Form.Item>
      <Form.Item>
        <Button type="success" htmlType="submit">Save</Button>
      </Form.Item>
    </Form>
  </Card>
}