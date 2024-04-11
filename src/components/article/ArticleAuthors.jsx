import {Button, Card, List, Space} from "antd";
import {useGetArticleAuthorsQuery} from "../../services/articles";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faList, faTrashCan, faUserPlus} from "@fortawesome/free-solid-svg-icons";
import {useState} from "react";
import {NewArticleAuthor} from "./NewArticleAuthor";

export const ArticleAuthors = ({article, authors})=>{

  const {data, isLoading} = useGetArticleAuthorsQuery(article)
  const [isNew, setIsNew] = useState(false)
  const [isSelect, setIsSelect] = useState(false)
  console.log(data)
  return <Card
      title="Article authos"
      extra={<Space>
        <Button
            icon={<FontAwesomeIcon icon={faUserPlus} />}
            onClick={()=>setIsNew(true)}
            type="success"
        />
        <Button
            icon={<FontAwesomeIcon icon={faList} />}
            onClick={()=>setIsSelect(true)}
            type="primary"
        />
      </Space>}
  >
    <List
        loading={isLoading}
        dataSource={data?.data}
        renderItem={(author) => (
            <List.Item
                key={author.id}
                actions={[
                    <Button
                        danger
                        type="primary"
                        icon={<FontAwesomeIcon icon={faTrashCan} />}
                        onClick={()=>{}}
                    />
                ]}>
              <List.Item.Meta title={author.full_name} />
            </List.Item>
        )}
    />
    <NewArticleAuthor
        open={isNew}
        onOk={()=>{}}
        onCancel={()=>{}}
        article={article}
    />
  </Card>
}