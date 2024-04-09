import {Button, Card, Space} from "antd";
import {useGetImagesByArticleQuery} from "../../services/images";
import {PlusOutlined} from "@ant-design/icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUpload} from "@fortawesome/free-solid-svg-icons";
import {Uploader} from "../images/Uploader";
import {useState} from "react";

export const ArticleImages = ({article}) => {
  const [isUpload, setIsUpload] = useState(false)
  const {data, isLoading} = useGetImagesByArticleQuery(article)
  return <Card
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
  <Uploader open={isUpload} article={article} />
  </Card>
}