import {useNavigate, useParams} from "react-router-dom";
import {useGetArticleQuery, useUpdateArticleMutation} from "../../../services/articles";
import i18n from "../../../i18n";
import {Button, Card, Col, Divider, Form, Input, notification, Row, Select, Space, Switch} from "antd";
import 'react-quill/dist/quill.snow.css';
import {ArticleEditor} from "../../../components/article/Editor";
import {ArticleImages} from "../../../components/article/ArticleImages";
import {FeaturedLists} from "../../../components/article/FeaturedLists";
import {unlockArticle} from "../../../features/articleSlice";
import {ArticleAuthors} from "../../../components/article/ArticleAuthors";
import {SubmitEvents} from "../../../components/article/SubmitEvents";
import {useGetAllCategoriesQuery} from "../../../services/categories";
import ReactQuill from "react-quill";

export const Article = ()=>{
  const [form] = Form.useForm();
  const {article} = useParams()
  const {data, isLoading} = useGetArticleQuery({article, locale: i18n.language})
  const [updateArticle, {isSuccess: updateSuccess}] = useUpdateArticleMutation()
  const {data: categories, isLoading: categoriesLoading} = useGetAllCategoriesQuery(i18n.language)

  const { Item } = Form;

  const navigate = useNavigate();

  const close = ()=>{
    unlockArticle(data?.data.id)
    navigate(`/content/categories/${data?.data.category_id}`)
  }

  const onFinish = () => {
    form.validateFields()
        .then(values=>{
          updateArticle({
            article,
            body:
                {...values},
            locale: i18n.language})
        })
  }

  if (updateSuccess) notification.success({
    message: "Articol salvat!!!"
  })
  const options = data?.data.keywords?.map((keyword)=>({
    value: keyword,
    label: keyword,
  }))
  return <Card
      loading={isLoading || categoriesLoading}
  >
    <Form
      form={form}
      onFinish={onFinish}
      initialValues={{
        title: data?.data.title,
        lead: data?.data.lead,
        body: data?.data.body,
        status: data?.data.status,
        is_flash: data?.data.is_flash,
        is_breaking: data?.data.is_breaking,
        is_alert: data?.data.is_alert,
        is_live: data?.data.is_live,
        is_video: data?.data.is_video,
        embed: data?.data.embed,
        category_id: data?.data.category_id,
        telegram_post: data?.data.telegram_post,
        telegram_embed: data?.data.telegram_embed,
        keywords: data?.data.keywords,
      }}
    >
      <Space direction="horizontal" style={{
        marginBottom: 20
      }}>
        <Item style={{
          margin: 0
        }}>
          <Button htmlType="submit" type="success">
            Submit
          </Button>
        </Item>
         <Button type="primary" danger onClick={close}>Close</Button>
      </Space>
      <Item
          name="title"
      ><Input
          maxLength={200}
          showCount={true}
          size="large"
      /></Item>

      <Row>
        <Col span={18}>
          <Item
              name="lead"
          >
            <ArticleEditor
                field={'lead'}
                images={data?.data.images}
                onEdit={(data)=>{
                  form.setFieldsValue({
                    lead: data,
                  })
                }}
                initialValue={data?.data.lead}
            />
          </Item>
          <Divider orientation="vertical" />
          <Item
              name="body"
          >
            <ArticleEditor
                field={'body'}
                images={data?.data.images}
                onEdit={(data)=>{
                  form.setFieldsValue({
                    body: data,
                  })
                }}
                initialValue={data?.data.body}
            />
          </Item>
          <Item
              name="keywords"
              label="Keywords"
          >
           <Select
               mode="tags"
               options={options}
           />
          </Item>
          <FeaturedLists article={article}/>
          <ArticleAuthors article={article} />
          <Item name="is_live" label="Live article">
            <Switch />
          </Item>
          <Item name="embed" label="Embed Code">
            <Input.TextArea />
          </Item>
          <Item
              name="telegram_post"
              label="Telegram"
          >
            <ReactQuill />
          </Item>
          <Item
              name="telegram_embed"
              label="Telegram Embed"
          >
            <Input.TextArea />
          </Item>
        </Col>
        <Col span={6}>
          <Card>
            <h3>Category</h3>
            <Item name="category_id">
              <Select
                  options={categories?.data.map(category=>({
                    label: category.title,
                    value: category.id,
                  }))}
              />
            </Item>
            <Divider />
            <Item
                name="status"
            >
              <Select>
                <Select.Option value="N">New</Select.Option>
                <Select.Option value="S">Submitted</Select.Option>
                <Select.Option value="P">Published</Select.Option>
              </Select>
            </Item>
            {
              data?.data.status === "S" && <SubmitEvents article={article} publish_at={data?.data.publish_at}/>
            }
            <Divider />
            <Item
                name="is_flash"
                label="FLASH"
            >
              <Switch />
            </Item>
            <Item
                name="is_breaking"
                label="BREAKING"
            >
              <Switch />
            </Item>
            <Item
                name="is_alert"
                label="ALERT"
            >
              <Switch />
            </Item>
            <Divider />
            <Item name="is_video" label="Video">
              <Switch />
            </Item>
          </Card>
          <ArticleImages article={article} />
        </Col>
      </Row>
    </Form>
  </Card>
}