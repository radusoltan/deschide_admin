import {Form, Input, Modal} from "antd";
import {useAddArticleAuthorMutation} from "../../services/articles";

export const NewArticleAuthor = ({open, onOk, onCancel, article}) => {
  const [form] = Form.useForm()
  const [addArticleAuthor] = useAddArticleAuthorMutation()
  return <Modal
      open={open}
      onOk={()=>{
        form.validateFields()
            .then(values=>{
              addArticleAuthor({
                article,
                body: {...values}
              })
            })
      }}
      onCancel={()=>{}}
  >
    <Form
        form={form}
        name="new_article_author_form"
        layout="vertical"
    >
      <Form.Item
          name="first_name"
          label="First Name"
          rules={[
            {required: true, message: 'First Name is required'}
          ]}
      ><Input /></Form.Item>
      <Form.Item
          name="last_name"
          label="Last Name"
          rules={[
            {required: true, message: 'Last Name is required'}
          ]}
      ><Input /></Form.Item>
      <Form.Item
          name="email"
          label="Email"
          rules={[
            {required: true, message: 'Email is required'},
            {type: 'email'}
          ]}
      ><Input /></Form.Item>
    </Form>
  </Modal>
}