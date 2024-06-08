import {Card, Form, Image, Input, Modal} from "antd";
import {useUpdateImageMutation} from "../../services/images";

export const EditImageCreds = ({image, open, onOk, onCancel})=>{
  const [form] = Form.useForm();

  console.log(image)

  const [updateImage] = useUpdateImageMutation()

  return <Modal
      open={open}
      onOk={()=>{
        form.validateFields()
        .then(values=>{

          updateImage({
            image: image.id,
            body: {...values}
          })
          form.resetFields()
          onOk()
        })
      }}
      onCancel={()=>{
        form.resetFields()
        onCancel()
      }}
  >
    <Form form={form}
          name="image_edit_form"
          layout="vertical"
          initialValues={{
            source: image.source,
            description: image.description,
            author: image.author,
          }}
    >
      <Card
        cover={
          <Image
              src={process.env.REACT_APP_URL + image.path + '/' + image.name}
              preview={false}
          />
        }
      />
      <Form.Item
          name="author"
          label="Image Author"
          rules={[
              {required: true},
          ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
          name="source"
          label="Image Source"
          rules={[
            {required: true},
          ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
          name="description"
          label="Description"
      >
        <Input.TextArea />
      </Form.Item>
    </Form>
  </Modal>
}