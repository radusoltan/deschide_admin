import {Card, Form, Input, Modal, Select} from "antd";
import {useAddUserMutation} from "../../../services/users";

export const NewUser = ({open, roles, onOk, onCancel})=>{
  const [form] = Form.useForm()
  const [addUser] = useAddUserMutation()
  return <Modal
    open={open}
    onOk={()=>{
      form.validateFields()
        .then(values=>{
          addUser(values)
          form.resetFields()
          onOk()
        })
    }}
    onCancel={()=>{
      form.resetFields()
      onCancel()
    }}
  >
    <Card>
      <Form
        form={form}
      >
        <Form.Item
          name="name"
          label="User Name"
          rules={[
            {required: true},
          ]}

        ><Input /></Form.Item>
        <Form.Item
          name="email"
          label="User Email"
          rules={[
              {required: true},
            {tupe: "email"}
          ]}
        ><Input /></Form.Item>
        <Form.Item
            name="password"
            label="Password"
            rules={[
                {required: true},
            ]}
        ><Input.Password /></Form.Item>
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
      </Form>
    </Card>
  </Modal>
}