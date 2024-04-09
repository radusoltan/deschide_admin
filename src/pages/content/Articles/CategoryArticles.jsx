import {Button, Card, Form, Input, Modal, Pagination, Select, Space, Table, notification} from "antd";
import {useAddCategoryArticleMutation, useGetCategoryArticlesQuery} from "../../../services/articles";
import {Link, useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import i18n from "../../../i18n";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSquarePlus} from "@fortawesome/free-solid-svg-icons";

export const CategoryArticles = () => {

  const [isNew, setIsNew] = useState(false)
  const {category} = useParams()
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [locale, setLocale] = useState(i18n.language)

  const [form] = Form.useForm()

  i18n.on('languageChanged', locale=>setLocale(locale))


  const [addCategoryArticle,{error, isSuccess, data: article}] = useAddCategoryArticleMutation()
  const {data, isLoading, isSuccess: articlesSuccess} = useGetCategoryArticlesQuery({category, locale, page})


  useEffect(() => {
    if (isSuccess) {
      form.resetFields()
      setIsNew(false)
      navigate(`/content/articles/${article.data.id}`)
    }
    if (error){
      console.log(error)
      notification.error({
        message: error.data[2]
      })
    }
  }, [error, isSuccess, articlesSuccess]);

  const articles = data?.data.map(article=>({
    key: article.id,
    title: article.title ?? 'No translation',
    status: article.status,
  }))

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text, {key}) => <Link to={`/content/articles/${key}`}>{text}</Link>
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text, {key}) => (text)
    }
  ]

  return <Card
      loading={isLoading}
      extra={<Space>
        <Button
            type="success"
            icon={<FontAwesomeIcon icon={faSquarePlus} />}
            onClick={()=>setIsNew(true)}
        />
      </Space>}
  >
    <Table pagination={false} columns={columns} dataSource={articles} />
    <Pagination
        total={data?.meta.total}
        defaultCurrent={data?.meta.current_page}
        onChange={page=>setPage(page)}
    />
    <Modal
        open={isNew}
        onOk={()=>{
          form.validateFields()
              .then(({title, locale})=>{
                addCategoryArticle({
                  category,
                  locale,
                  body: {title}
                })
              })
        }}
        onCancel={()=>{
          form.resetFields()
          setIsNew(false)
        }}
    >
      <Card>
        <Form
            form={form}
            layout='vertical'
            initialValues={{
              locale
            }}
            name="new_article_from"
        >
          <Form.Item
              name="locale"
              label="Select Language"
              rules={[
                {required: true, message: 'Please select a language'}
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
              name="title"
              label="___Article Title"
              rules={[
                {required: true, message: '___Article title is required'}
              ]}
          ><Input /></Form.Item>
        </Form>
      </Card>
    </Modal>
  </Card>
}