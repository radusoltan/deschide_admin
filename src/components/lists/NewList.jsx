import {Card, Form, Input, InputNumber, Modal} from "antd";
import {useAddListMutation} from "../../services/articlesList";

export const NewList = ({open, onOk, onCancel})=>{
  const [form] = Form.useForm();
  const [addList] = useAddListMutation()
  return <Modal
      open={open}
      onOk={()=>{
        form.validateFields()
            .then(values=>{
              addList(values)
              form.resetFields()
              onOk()
            })
      }}
      onCancel={()=>onCancel()}
  >
    <Card>
      <Form
          form={form}
          layout="vertical"
      >
        <Form.Item
            name="title"
            label="List Title"
            rules={[
                {required: true, message: 'Title is required'}
            ]}
        ><Input /></Form.Item>
        <Form.Item
            name="max_item_count"
            label="Maximum Items"
            rules={[
              {required: true, message: 'Maximum Items is required'},
              {type: 'number'}
            ]}
        ><InputNumber /></Form.Item>
      </Form>
    </Card>
  </Modal>
}