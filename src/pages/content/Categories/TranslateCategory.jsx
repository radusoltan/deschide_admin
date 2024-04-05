import {Button, Card, Form, Input, Select} from "antd";
import {useNavigate, useParams} from "react-router-dom";
import {useGetCategoryQuery, useUpdateCategoryMutation} from "../../../services/categories";
import {useEffect, useState} from "react";
import i18n from "../../../i18n";

export const TranslateCategory = () => {

  const [locale, setLocale] = useState(i18n.language)

  i18n.on('languageChanged', locale=>{
    setLocale(locale)
  })

  const navigate = useNavigate()

  const {category} = useParams()

  const {data, isLoading} = useGetCategoryQuery({category, locale})
  const [updateCategory, {isSuccess}] = useUpdateCategoryMutation()

  useEffect(() => {
    if (isSuccess) {
      navigate('/content/categories')
    }
  },[isSuccess, navigate])

  return <Card title="Translate category" loading={isLoading}>
    <Form
        name="translate_category_form"
        layout='vertical'
        onFinish={({title, locale})=>{
          updateCategory({
            category,
            body: {title},
            locale: locale
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
          name='locale'
          label="Select Language"
          rules={[
            {required: true}
          ]}
      >
        <Select
            // defaultValue={i18n.language}
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