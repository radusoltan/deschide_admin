import {Card, Form, Input, InputNumber, Modal} from "antd";
import {useAddRenditionMutation} from "../../services/images";

export const NewRendition = ({open, onOk, onCancel}) => {

  const [form] = Form.useForm()
  const [addRendition] = useAddRenditionMutation()

  return <Modal
      open={open}
      onOk={()=>{
        form.validateFields()
            .then(values=>{
              addRendition(values)
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
          layout="vertical"
      >
        <Form.Item
            name="name"
            label="Rendition Name"
            rules={[
                {required: true, message: 'Rendition Name is required'}
            ]}
        ><Input /></Form.Item>
        <Form.Item
            name="width"
            label="Rendition Width"
            rules={[
                {required: true, message: 'Width is required'},
            {type: 'number'}
            ]}
        ><InputNumber /></Form.Item>
        <Form.Item
            name="height"
            label="Rendition Height"
            rules={[
                {required: true, message: 'Height is required'},
                {type: 'number'}
            ]}
        ><InputNumber /></Form.Item>
      </Form>
    </Card>
  </Modal>
}