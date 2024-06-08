import {Button, Card, Form, Input, Modal, Pagination, Select, Space, Table, notification, AutoComplete} from "antd";
import {
  useAddCategoryArticleMutation,
  useGetCategoryArticlesQuery, useSearchArticlesMutation
} from "../../../services/articles";
import {Link, useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import i18n from "../../../i18n";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faLockOpen, faSquarePlus} from "@fortawesome/free-solid-svg-icons";
import {unlockArticle} from "../../../features/articleSlice";
import {SearchOutlined} from "@ant-design/icons";

export const CategoryArticles = () => {

  const [isNew, setIsNew] = useState(false)
  const {category} = useParams()
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [locale, setLocale] = useState(i18n.language)
  const [searchOptions, setSearchOptions] = useState([])

  const [form] = Form.useForm()

  i18n.on('languageChanged', locale=>setLocale(locale))


  const [addCategoryArticle,{error, isSuccess, data: article}] = useAddCategoryArticleMutation()
  const {data, isLoading, isSuccess: articlesSuccess} = useGetCategoryArticlesQuery({category, locale, page})
  const [searchArticle,{isSuccess: searchIsSuccess, data: searchResults}] = useSearchArticlesMutation()


  useEffect(() => {
    if (isSuccess) {
      form.resetFields()
      setIsNew(false)
      navigate(`/content/articles/${article.data.id}`)
    }
    if (articlesSuccess){
      const articles = data?.data.map(article=> {

        return {
          label: article.title,
          value: String( article.id),
        }
      })
      setSearchOptions(articles)
    }
    if (error){
      console.log(error)
      notification.error({
        message: error.data[2]
      })
    }
    if (searchIsSuccess) {
      const articles = searchResults?.data.map(article=>({
        label: article.title,
        value: String(article.article_id),
      }))
      setSearchOptions(articles)
    }
  }, [error, isSuccess, articlesSuccess, searchIsSuccess]);

  const articles = data?.data.map(article=>({
    key: article.id,
    title: article.title ?? 'No translation',
    status: article.status,
    is_locked: article.is_locked,
    visits: article.visits,
    created_at: article.created_at,
    updated_at: article.updated_at,
  }))

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text, {key, is_locked}) => {

        return is_locked ? <span>{text}</span> : <Link to={`/content/articles/${key}`}>{text}</Link>
      }
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text, {key, is_locked}) => is_locked ? <Button icon={<FontAwesomeIcon icon={faLockOpen} onClick={()=>{
        unlockArticle(key)
      }} />} /> : (text)
    },
    {
      title: "Visits",
      dataIndex: "visits",
      key: "visits",
      render: (text, {key, is_locked}) => <span>{text}</span>
    },
    {
      title: "Created",
      dataIndex: "created_at",
      key: "created_at",
      render: (text, {key, is_locked}) => text
    },
    {
      title: "Updated",
      dataIndex: "updated_at",
      key: "updated_at",
      render: (text, {key, is_locked}) => text
    }
  ]

  const onSearch = (data) => {

    searchResults?.data.filter(article=>{
      const translation = article.translations.find(t=>t.locale === i18n.language)

      return {
        label: translation ? translation.title : '',
        value: String(article.id)
      }
    })
    // console.log('filtered',filtered)

      searchArticle({
        query: data
      })
  }

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
    <AutoComplete
        style={{
          width: "100%"
        }}
        options={searchOptions}
        allowClear={true}
        onChange={(data, option)=>{
          console.log(option)
        }}
        onSearch={onSearch}
        onSelect={(data, option)=>{
          // console.log(data)
          navigate(`/content/articles/${data}`)
        }}
        onClear={(data)=>{

        }}
    >
      <Input prefix={<SearchOutlined />} placeholder="search article" />
    </AutoComplete>
    <Table pagination={false} columns={columns} dataSource={articles} />
    <Pagination
        total={data?.meta.total}
        defaultCurrent={data?.meta.current_page}
        onChange={page=>setPage(page)}
        hideOnSinglePage={true}
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