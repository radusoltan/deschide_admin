import {Button, Card, Form, Input, Spin} from "antd";
import {useNavigate, useParams} from "react-router-dom";
import {useGetAuthorQuery, useUpdateAuthorMutation} from "../../services/articles";
import i18n from "../../i18n";
import {useEffect, useState} from "react";

export const EditAuthor = () => {
  const navigate = useNavigate();
  const {author} = useParams()
  const [locale, setLocale] = useState(i18n.language)
  const {data, isLoading} = useGetAuthorQuery({author, locale})
  const [updateAuthor,{isSuccess}] = useUpdateAuthorMutation()
  const [form] = Form.useForm()

  i18n.on('languageChanged', locale=>{
    setLocale(locale)
  })

  useEffect(() => {
    if (isSuccess) {
      form.resetFields()
      navigate('/content/authors')
    }
  }, [isSuccess]);

  return <Card loading={isLoading}>
    <Form
        form={form}
        name="edit_author_form"
        initialValues={{
          first_name: data?.data.first_name,
          last_name: data?.data.last_name,
          email: data?.data.email,
        }}
        layout="vertical"
        onFinish={values=>{
          updateAuthor({
            author,
            locale,
            body: {...values},
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
            {type: 'email'},
          ]}
      ><Input /></Form.Item>
      <Form.Item
      >
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  </Card>
}