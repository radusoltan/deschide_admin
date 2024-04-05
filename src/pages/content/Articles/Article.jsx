import {
  Button,
  Card,
  Col,
  Divider,
  Input,
  notification,
  Row,
  Select,
  Space,
  Switch
} from "antd"
import {useEffect, useState} from "react"
import i18n from "../../../i18n"
import {
  useNavigate,
  useParams
} from "react-router-dom"
import {
  useGetArticleQuery,
  useUpdateArticleMutation
} from "../../../services/articles"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {
  faCircleXmark,
  faFloppyDisk
} from "@fortawesome/free-solid-svg-icons"
import {ArticleEditor} from "../../../components/article/Editor"

export const Article = ()=>{

  const {article} = useParams()
  const navigate = useNavigate()

  const [articleData, setArticleData] = useState({})

  const {data, isLoading, isSuccess} = useGetArticleQuery({article, locale: i18n.language})
  const [updateArticle, {data: articleUpdated, isSuccess: updatedSuccess}] = useUpdateArticleMutation()

  const save = ()=>{
    updateArticle({article, body: {...articleData}, locale: i18n.language})
  }

  const saveAndClose = ()=>{
    save()
    setTimeout(()=>navigate(`/content/categories/${articleData.category_id}`), 2000)
  }

  const close = ()=> navigate(`/content/categories/${articleData.category_id}`)

  useEffect(() => {
    if (isSuccess){
      setArticleData(data.data)
    }
    if (updatedSuccess){
      setArticleData(articleUpdated.data)
      notification.success({
        message: 'Successfully updated article',
        duration: 2
      })
    }
  }, [isSuccess, updatedSuccess])

  return <Card
    loading={isLoading}
    extra={<Space>
      <Button
        type="success"
        icon={<FontAwesomeIcon icon={faFloppyDisk} />}
        onClick={save}
      >Save</Button>
      <Button
        type="warning"
        icon={<Space>
          <FontAwesomeIcon icon={faFloppyDisk} />
          <FontAwesomeIcon icon={faCircleXmark} />
        </Space>}
        onClick={saveAndClose}
      >Save & Close</Button>
      <Button
        type="primary"
        danger
        onClick={close}
        icon={<FontAwesomeIcon icon={faCircleXmark} />}
      >Close</Button>
    </Space>}
  >
    <Input
      maxLength={200}
      showCount={true}
      size="large"
      value={articleData.title}
      onChange={e=>{
        setArticleData(prevState => ({
          ...prevState,
          title: e.target.value,
        }))
      }}
    />
    <Row>
      <Col span={18}>
        <Card>
          <ArticleEditor
            field="lead"
            initialValue={articleData.lead}
            onEdit={lead => setArticleData(prevState => ({
              ...prevState,
              lead
            }))}
          />
          <Divider />
          <ArticleEditor
            initialValue={articleData.body}
            onEdit={body => {
              setArticleData(prevState => ({
                ...prevState,
                body: body
              }))
            }}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Select
            onChange={status=>{
              setArticleData(prevState => ({
                ...prevState,
                status
              }))
            }}
            value={articleData.status}
          >
            <Select.Option value="N">New</Select.Option>
            <Select.Option value="S">Submitted</Select.Option>
            <Select.Option value="P">Published</Select.Option>
          </Select>
          <Divider />
          <Space direction="vertical">
            <p>FLASH</p>
            <Switch
              onChange={(e) => {
                setArticleData(prevState => ({
                  ...prevState,
                  is_flash: e,
                  is_breaking: false,
                  is_alert: false
                }))
              }}
              checked={articleData.is_flash}
            />
            <p>ALERT</p>
            <Switch
              onChange={(e) => {
                setArticleData(prevState => ({
                  ...prevState,
                  is_flash: false,
                  is_breaking: false,
                  is_alert: e
                }) )
              }}
              checked={articleData.is_alert}
            />
            <p>BREAKING</p>
            <Switch
              onChange={(e) => {
                setArticleData(prevState => ({
                  ...prevState,
                  is_flash: false,
                  is_breaking: e,
                  is_alert: false
                }) )
              }}
              checked={articleData.is_breaking}
            />
          </Space>
        </Card>
      </Col>
    </Row>
  </Card>
}