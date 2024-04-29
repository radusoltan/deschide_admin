import {Button, Card, Flex, List, Pagination} from "antd";
import {useParams} from "react-router-dom";
import {
  useAddArticleToListMutation,
  useDeleteArticleFromListMutation,
  useGetListQuery
} from "../../services/articlesList";
import {useEffect, useState} from "react";
import i18n from "../../i18n";
import {useGetArticlesQuery} from "../../services/articles";
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus, faTrashCan} from "@fortawesome/free-solid-svg-icons";

export const EditList = () => {
  const {list} = useParams()

  const [locale, setLocale] = useState(i18n.language)
  const [page, setPage] = useState()

  const {data, isSuccess, isLoading} = useGetListQuery(list)
  const {data: articlesData, isLoading: articlesIsLoading, isSuccess: articlesIsSuccess} = useGetArticlesQuery({page, locale})
  const [addArticleToList] = useAddArticleToListMutation()
  const [deleteArticleFromList] = useDeleteArticleFromListMutation()




  return <Card
      loading={isLoading || articlesIsLoading}
      title={`Edit list: ${data?.data.title} | Max Items: ${data?.data.max_item_count} || Count: ${data?.data.count}`}
  >
    <Flex>
      <Card
        style={{ width: "50%" }}
      >
        <List
            itemLayout="horizontal"
            dataSource={articlesData?.data}
            renderItem={(article)=>(
                <List.Item
                    actions={[
                        <Button
                            icon={<FontAwesomeIcon icon={faPlus} />}
                            onClick={()=>{
                              addArticleToList({article:article.id, list})
                            }}
                        />
                    ]}
                >
                  <List.Item.Meta title={article.title} />
                </List.Item>
            )}
        />
        <Pagination
            total={articlesData?.meta.total}
            onChange={(page) =>setPage(page)}
            showSizeChanger={false}
        />
      </Card>
      <Card
          style={{ width: "50%" }}
      >
        <List
            itemLayout="horizontal"
            dataSource={data?.data.articles}
            renderItem={(article)=>(
                <List.Item
                    actions={[
                      <Button
                          icon={<FontAwesomeIcon icon={faTrashCan} />}
                          onClick={()=>{
                            deleteArticleFromList({article:article.id, list})
                          }}
                      />
                    ]}
                >
                  <List.Item.Meta title={article.title} />
                </List.Item>
            )}
        />
      </Card>
    </Flex>
  </Card>
}