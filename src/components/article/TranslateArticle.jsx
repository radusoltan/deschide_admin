import {Button, Card, Form, Input, Select, Space} from "antd";
import i18n from "../../i18n";
import {useNavigate, useParams} from "react-router-dom";
import {useGetArticleQuery, useUpdateArticleMutation} from "../../services/articles";
import {useEffect} from "react";

export const TranslateArticle = ()=>{
  const {article} = useParams()
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const {data, isLoading} = useGetArticleQuery({article, locale: 'ro'})
  const [updateArticle,{isSuccess}] = useUpdateArticleMutation()
  useEffect(() => {
    if(isSuccess){
      navigate(`/content/articles/${data?.data.id}`)
    }
  }, [isSuccess]);


  return <Card
      extra={<Space>
        <Button
            type="success"
            onClick={()=>{
              form.validateFields()
                  .then(values=>{

                    const {locale, title} = values
                    console.log(i18n.language)
                    i18n.changeLanguage(locale)
                    updateArticle({
                      article,
                      body:
                          {
                            "category_id": data?.data.category_id,
                            "is_video": data?.data.is_video,
                            "status": "S",
                            "is_flash": false,
                            "is_alert": false,
                            "is_breaking": false,
                            "is_live": false,
                            "embed": data?.data.embed,
                            ...values
                          },
                      locale: i18n.language})
                  })
            }}
        >Submit</Button>
      </Space>}
  >
    <Form form={form}>
      <Form.Item name="locale" label="Language" rules={[
        { required: true, message: "Please select language" }
      ]}>
        <Select options={[
          {value: 'ro', label: 'Romana'},
          {value: 'en', label: 'English'},
          {value: 'ru', label: 'Russian'},
        ]}/>

      </Form.Item>
      <Form.Item
          name="title"
          label="Title"
          rules={[
            { required: true, message: "Please add title" }
          ]}
      ><Input /></Form.Item>
    </Form>
  </Card>
}