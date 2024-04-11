import {
  Button,
  Card,
  Col, DatePicker,
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
  useDeleteArticlePublishTimeMutation,
  useGetArticleQuery, useSetArticlePublishTimeMutation,
  useUpdateArticleMutation
} from "../../../services/articles"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {
  faCircleXmark,
  faFloppyDisk, faTrashCan
} from "@fortawesome/free-solid-svg-icons"
import {ArticleEditor} from "../../../components/article/Editor"
import {ArticleImages} from "../../../components/article/ArticleImages";
import {SubmitEvents} from "../../../components/article/SubmitEvents";
import moment from "moment";
import {ArticleAuthors} from "../../../components/article/ArticleAuthors";

export const Article = ()=>{

  const {article} = useParams()
  const navigate = useNavigate()

  const [articleData, setArticleData] = useState({})

  const {data, isLoading, isSuccess} = useGetArticleQuery({article, locale: i18n.language})
  const [updateArticle, {data: articleUpdated, isSuccess: updatedSuccess}] = useUpdateArticleMutation()
  const [setArticlePublishTime, {isSuccess: setIsSuccess, data: setData}] = useSetArticlePublishTimeMutation()
  const [deletePublishEvent, {isSuccess: deleteSuccess, data: deleteData}] = useDeleteArticlePublishTimeMutation()

  const save = (saveType)=>{
    updateArticle({
      article,
      body:
          {...articleData,saveType},
      locale: i18n.language})
  }

  const saveAndClose = ()=>{

    save('close')
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

  const date = moment(articleData.publish_at)

  return <Card
    loading={isLoading}
    extra={<Space>
      <Button
        type="success"
        icon={<FontAwesomeIcon icon={faFloppyDisk} />}
        onClick={()=>{
          save('save')
        }}
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
    <ArticleAuthors article={article} authors={articleData.authors} />
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
          {

              articleData.status === "S" && <Card title="Select publish time" style={{
                marginTop: 25
              }}>
                {articleData.publish_at && <Space direction="vertical">
                  <div style={{marginBottom: 20}}>
                    <div style={{ padding: 5, border: '1px solid #e9e9e9' }}>
                      {date.format('MMM DD YYYY kk:mm')}
                      <Button
                          type="primary"
                          danger
                          icon={<FontAwesomeIcon icon={faTrashCan} />}
                          onClick={()=>deletePublishEvent(article)}
                          style={{
                            marginLeft: 50
                          }}
                      />
                    </div>
                  </div>
                </Space>}
                <Space direction="vertical">
                  <DatePicker
                      showTime
                      onChange={()=>{

                      }}
                      onOk={date=>{
                        setArticlePublishTime({
                          article,
                          body: {
                            time: date.format()
                          }
                        })
                      }}
                  />
                </Space>
              </Card>
          }
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
        <ArticleImages article={article} />
      </Col>
    </Row>
  </Card>
}