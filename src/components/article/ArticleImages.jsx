import {Button, Card, Col, Divider, Image, Modal, Radio, Space} from "antd";
import {
  useDetachArticleImageMutation,
  useGetImagesByArticleQuery,
  useSetArticleMainImageMutation
} from "../../services/images";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCrop, faTrashCan, faUpload} from "@fortawesome/free-solid-svg-icons";
import {Uploader} from "../images/Uploader";
import {useState} from "react";
import {Cropper} from "../images/Cropper";

export const ArticleImages = ({article}) => {
  const [isUpload, setIsUpload] = useState(false)
  const [isCrop, setIsCrop] = useState(false)
  const {data, isLoading} = useGetImagesByArticleQuery(article)

  const [detachArticleImage] = useDetachArticleImageMutation()
  const [setArticleMainImage] = useSetArticleMainImageMutation()

  const images = data?.data.map(image=>{

    return <Col key={image.id}>
      <Card
          cover={
            <Image src={process.env.REACT_APP_URL + image.path + '/' + image.name} preview={false} />
          }
          styles={image.is_main && {
            background: '#fof2f5',
            boxShadow: '0 1px 2px -2px rgb(0 0 0 / 16%), 0 3px 6px 0 rgb(0 0 0 / 12%), 0 5px 12px 4px rgb(0 0 0 / 9%)'
          }}
      >
        <Divider orientation="right">{image.width+` x `+image.height}</Divider>
        <Radio checked={image.is_main} onChange={()=>{
          setArticleMainImage({
            article,
            image: image.id
          })
        }} />
        <Space>
          <Button
              danger
              type="primary"
              onClick={()=>{
                detachArticleImage({article, id: image.id})
              }}
              icon={<FontAwesomeIcon icon={faTrashCan} />}
          />
          {image.is_main &&
              <Button
                  type="primary"
                  icon={<FontAwesomeIcon icon={faCrop} />}
                  onClick={()=>setIsCrop(true)}
              />
          }
        </Space>
      </Card>
    </Col>
  })

  return (<Card
      title="Article Images"
      loading={isLoading}
      extra={<Space>
        <Button
            type="success"
            icon={<FontAwesomeIcon icon={faUpload} />}
            onClick={()=>setIsUpload(true)}
        />
      </Space>}
  >
    {images}
  <Uploader
      open={isUpload}
      article={article}
      onOk={()=>setIsUpload(false)}
      onCancel={()=>setIsUpload(false)}
  />
    {data?.data.length > 0 &&

          <Cropper
            image={data?.data.find(image=>image.is_main)}
            open={isCrop}
            onOk={()=>setIsCrop(false)}
            onCancel={()=>setIsCrop(false)}
          />

    }
  </Card>)
}