import {Button, Card, Col, Flex, List, Pagination, Row, Space} from "antd";
import {
  useAddArticlesToListMutation,
  useDeleteArticleFromListMutation,
  useGetArticlesQuery,
  useGetListQuery
} from "../../services/articles";
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFloppyDisk, faTrashCan} from "@fortawesome/free-solid-svg-icons";

export const EditList = ()=>{
  const {list} = useParams()
  const {data, isLoading, isSuccess} = useGetListQuery(list)

  const [page, setPage] = useState(1)
  const [articles, setArticles] = useState([]);

  const [listArticles, setListArticles] = useState([]);

  const {data: articlesList, isSuccess: articlesListSuccess, isLoading: articlesLoading} = useGetArticlesQuery({page, locale: 'ro'})

  const [addArticlesToList] = useAddArticlesToListMutation()
  const [deleteArticleFromList] = useDeleteArticleFromListMutation()

  const handleDrop = result => {
    const { destination, source, draggableId } = result;
    if (!destination) return

    const sourceIndex = source.index
    const destinationIndex = destination.index
    const draggedArticle = articles[sourceIndex]

    const newArticles = [...articles]
    newArticles.splice(sourceIndex, 1)
    const newListArticles = [...listArticles, draggedArticle]


    setArticles(newArticles);
    setListArticles(newListArticles)
  }

  useEffect(() => {
    if (isSuccess) {
      setListArticles(data.data.articles)
    }
    if (articlesListSuccess){
      setArticles(articlesList.data.filter(article=> {
        return !data.data.articles.some(listArticle=>listArticle.id === article.id)
      }))
    }
  }, [isSuccess, articlesListSuccess]);



  return <Card
      loading={isLoading || articlesLoading}
      title={`Edit list: ${data?.data.title} | Max Items: ${data?.data.max_item_count} | Actual Items: ${data?.data.count}`}
      extra={<Button
          type="success"
          icon={<FontAwesomeIcon icon={faFloppyDisk} />}
          onClick={()=>{

            addArticlesToList({
              list,
              ids: listArticles.map(({id})=>(id))
            })

          }}
      />}
  >

    <DragDropContext onDragEnd={handleDrop}>
      <Flex>
        <Card style={{ width: '50%' }}>
          <Droppable droppableId="articles">
            {provided => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                <List>
                {articles.map((article, index)=>(
                  <Draggable key={article.id} draggableId={String(article.id)} index={index}>
                    {provided => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <List.Item>
                          <List.Item.Meta title={article.title} />
                        </List.Item>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
                </List>
              </div>
            )}
          </Droppable>
        </Card>
        <Card style={{ width: '50%', minHeight: 100 }} >
          <Droppable droppableId="list">
            {provided => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                >
                  <List>
                    {listArticles.map((article, index)=>(
                        <Draggable key={article.id} index={index} draggableId={String(article.id)}>{
                          provided => (
                              <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                              >
                                <List.Item
                                    actions={[<Space>
                                      <Button
                                          danger
                                          type="primary"
                                          icon={<FontAwesomeIcon icon={faTrashCan} />}
                                          onClick={() => {
                                            deleteArticleFromList({
                                              list,
                                              article: article.id
                                            })
                                            console.log('article', article.id)
                                            console.log('list', list)
                                          }}
                                      />
                                    </Space>]}
                                >
                                  <List.Item.Meta title={article.title}/>
                                </List.Item>
                              </div>
                          )
                        }</Draggable>
                    ))}
                    {provided.placeholder}
                  </List>
                </div>
            )}
          </Droppable>
        </Card>
      </Flex>
    </DragDropContext>
  </Card>
}