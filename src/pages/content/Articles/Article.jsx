import {useNavigate, useParams} from "react-router-dom";
import {useGetArticleQuery, useUpdateArticleMutation} from "../../../services/articles";
import i18n from "../../../i18n";
import {Button, Card, Col, Divider, Form, Input, Row, Select, Space, Switch, Typography} from "antd";
import 'react-quill/dist/quill.snow.css';
import {ArticleEditor} from "../../../components/article/Editor";
import {ArticleImages} from "../../../components/article/ArticleImages";
import {FeaturedLists} from "../../../components/article/FeaturedLists";
import {unlockArticle} from "../../../features/articleSlice";

export const Article = ()=>{
  const [form] = Form.useForm();
  const {article} = useParams()
  const {data, isLoading} = useGetArticleQuery({article, locale: i18n.language})
  const [updateArticle] = useUpdateArticleMutation()

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

  return <Card
      loading={isLoading}
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
          <FeaturedLists article={article}/>
        </Col>
        <Col span={6}>
          <Card>
            <Item
                name="status"
            >
              <Select>
                <Select.Option value="N">New</Select.Option>
                <Select.Option value="S">Submitted</Select.Option>
                <Select.Option value="P">Published</Select.Option>
              </Select>
            </Item>
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
          </Card>
          <ArticleImages article={article} />
        </Col>
      </Row>
    </Form>
  </Card>
}