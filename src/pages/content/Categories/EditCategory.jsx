import {Button, Card, Form, Input, Switch} from "antd";
import {useNavigate, useParams} from "react-router-dom";
import {useGetCategoryQuery, useUpdateCategoryMutation} from "../../../services/categories";
import {useEffect, useState} from "react";
import i18n from "../../../i18n";

export const EditCategory = () => {

  const navigate = useNavigate()

  const {category} = useParams()
  const [locale, setLocale] = useState(i18n.language)

  i18n.on('languageChanged', locale=>{
    setLocale(locale)
  })

  const {data, isLoading} = useGetCategoryQuery({category, locale})
  const [updateCategory, {isSuccess}] = useUpdateCategoryMutation()

  useEffect(() => {
    if (isSuccess) {
      navigate('/content/categories')
    }
  }, [isSuccess]);

  return <Card title={"Edit category: "+data?.data.title} loading={isLoading}>
    <Form
        layout="vertical"
        name="new_category_form"
        initialValues={{
          title: data?.data.title ?? 'No translation',
          in_menu: data?.data.in_menu,
        }}
        onFinish={values=>{
          updateCategory({
            body: {...values},
            category,
            locale: i18n.language,
          })
        }}
    >
      <Form.Item
          label="Title"
          name='title'
          rules={[
            {required:true,message: 'Title is required'}
          ]}
      ><Input /></Form.Item>
      <Form.Item
          label="In Menu"
          name="in_menu"
          valuePropName="checked"
      >
        <Switch />
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