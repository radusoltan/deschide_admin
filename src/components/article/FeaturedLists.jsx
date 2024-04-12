import {Button, Card, Collapse, List, Modal} from "antd";
import {useAddArticleToList, useAddArticleToListMutation, useGetListsQuery} from "../../services/articles";
import i18n from "../../i18n";
import {useState} from "react";

export const FeaturedLists = ({open, onOk, onCancel, article})=>{
  const locale = i18n.language
  const {data} = useGetListsQuery({locale})
  const [addArticleToList] = useAddArticleToListMutation()
  const [selectedList, setSelectedList] = useState()


  const lists = data?.data.map(list => ({
    key: list.id,
    label: list.title,
    children: <Card extra={<Button
        onClick={()=>{
          addArticleToList({
            article,
            list: selectedList
          })
        }}
    >Add article to list</Button>}>
      <List
          dataSource={list.articles}
          renderItem={(article) =><List.Item>
            <List.Item.Meta title={article.title}  />
          </List.Item>}
      />
    </Card>
  }))

  return <Collapse items={lists} onChange={(ids)=>{
    if(Number(ids[0])){
      setSelectedList(Number(ids[0]))
    }
  }} />
}