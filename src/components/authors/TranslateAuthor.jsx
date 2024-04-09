import {Button, Card, Divider, Form, Input, Select, Space} from "antd";
import {useNavigate, useParams} from "react-router-dom";
import {useGetAuthorQuery, useUpdateAuthorMutation} from "../../services/articles";
import i18n from "../../i18n";
import {useEffect} from "react";

export const TranslateAuthor = () => {
  const navigate = useNavigate();
  const {author} = useParams()
  const {data, isLoading} = useGetAuthorQuery({author, locale: i18n.language})
  const [updateAuthor,{isSuccess}] = useUpdateAuthorMutation()

  useEffect(() => {
    if(isSuccess){
      navigate('/content/authors')
    }
  }, [isSuccess]);

  return <Card>
    <Space direction="vertical">{
      data?.data.translations.map(translation =>(<div key={translation.id}>
        <h3>{translation.locale}</h3>
        <h4 >{translation.full_name}</h4>
      </div>))
    }</Space>
    <Divider />
    <Form
        layout="vertical"
        onFinish={(values)=>{
          updateAuthor({
            author,
            locale: values.locale,
            body: {
              first_name: values.first_name,
              last_name: values.last_name,
            }
          })
        }}
    >
      <Form.Item label="First Name" name="first_name"><Input /></Form.Item>
      <Form.Item label="Last Name" name="last_name"><Input /></Form.Item>

      <Form.Item
          name='locale'
          label="Select Language"
          rules={[
            {required: true}
          ]}
      >
        <Select
            options={[
              {value: 'ro', label: 'Romana'},
              {value: 'en', label: 'English'},
              {value: 'ru', label: 'Russian'},
            ]}
        />
      </Form.Item>
      <Form.Item
      >
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  </Card>
}