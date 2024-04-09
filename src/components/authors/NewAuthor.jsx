import {Button, Card, Form, Input} from "antd";
import {useAddAuthorMutation} from "../../services/articles";
import i18n from "./../../i18n";
import {useEffect} from "react";
import {useNavigate} from "react-router-dom";

export const NewAuthor = () => {

  const navigate = useNavigate();
  const [form] = Form.useForm()

  const [addAuthor, {isLoading, isSuccess}] = useAddAuthorMutation()

  useEffect(() => {
    if (isSuccess) {
      navigate('/content/authors')
    }
  }, [isSuccess]);

  return <Card>
    <Form
        layout="vertical"
        form={form}
        onFinish={()=>{
          form.validateFields()
              .then(values=>{
                addAuthor({
                  body: {...values},
                  locale: i18n.language
                })
              })
        }}
    >
      <Form.Item
          name="first_name"
          label="First Name"
          rules={[
            {required:true,message: 'First Name is required'}
          ]}
      ><Input /></Form.Item>
      <Form.Item
          name="last_name"
          label="Last Name"
          rules={[
            {required:true,message: 'Last Name is required'}
          ]}
      ><Input /></Form.Item>
      <Form.Item
          name="email"
          label="Email"
          rules={[
            {required:true,message: 'Email is required'},
            {type: 'email'}
          ]}
      ><Input /></Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  </Card>
}