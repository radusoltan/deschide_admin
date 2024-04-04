import {Card, Form, Input, Modal, Checkbox} from "antd";
import {useAddRoleMutation} from "../../../services/users";

export const NewRole = ({open, onOk, onCancel, permissions})=>{
  const [form] = Form.useForm()
  const [addRole] = useAddRoleMutation()
  return <Modal
      open={open}
      onOk={()=>{
        form.validateFields()
          .then(values=>{
            addRole(values)
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
      <Form layout="vertical" form={form}>
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
      </Form>
    </Card>
  </Modal>
}