import {Button, Card, List, Space} from "antd";
import {useDeleteArticleAuthorMutation, useGetArticleAuthorsQuery} from "../../services/articles";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faList, faTrashCan, faUserPlus} from "@fortawesome/free-solid-svg-icons";
import {useState} from "react";
import {NewArticleAuthor} from "./NewArticleAuthor";
import {SelectArticleAuthor} from "./SelectArticleAuthor";

export const ArticleAuthors = ({article, authors})=>{

  const {data, isLoading} = useGetArticleAuthorsQuery(article)
  const [isNew, setIsNew] = useState(false)
  const [isSelect, setIsSelect] = useState(false)
  const [deleteArticleAuthor] = useDeleteArticleAuthorMutation()


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
                        onClick={()=>{
                          deleteArticleAuthor({
                            article,
                            author: author.id
                          })
                        }}
                    />
                ]}>
              <List.Item.Meta title={author.full_name} />
            </List.Item>
        )}
    />
    <NewArticleAuthor
        open={isNew}
        onOk={()=>setIsNew(false)}
        onCancel={()=>setIsNew(false)}
        article={article}
    />
    <SelectArticleAuthor
        open={isSelect}
        onOk={()=>setIsSelect(false)}
        onCancel={()=>setIsSelect(false)}
        article={article}
    />
  </Card>
}