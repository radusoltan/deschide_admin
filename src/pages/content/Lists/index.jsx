import {Button, Card, Pagination, Space, Table} from "antd";
import {useDeleteListMutation, useGetListsQuery} from "../../../services/articlesList";
import {useState} from "react";
import {Link} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCirclePlus, faTrashCan} from "@fortawesome/free-solid-svg-icons";
import {NewList} from "../../../components/lists/NewList";

export const Lists = ()=>{
  const [page, setPage] = useState(1)
  const {data, isLoading, isSuccess} = useGetListsQuery(1)
  const [deleteList] = useDeleteListMutation()
  const [isNew, setIsNew] = useState(false)

  const columns =[
    {
      title: "List title",
      dataIndex: "title",
      key: "title",
      render: (text,{key})=>(<Link to={`/content/lists/${key}`}>{text}</Link>)
    },
    {
      render: (text, {key}) => (<Space key={key}>
        <Button
            danger
            type="primary"
            icon={<FontAwesomeIcon icon={faTrashCan} />}
            onClick={()=>{
              deleteList(key)
            }}
        />
      </Space>)
    }
  ]

  const lists = data?.data.map(list=>({
    key: list.id,
    title: list.title,
  }))

  return <Card
      extra={<Space>
        <Button
            type="success"
            icon={<FontAwesomeIcon icon={faCirclePlus} />}
            onClick={()=>setIsNew(true)}
        />
      </Space>}
  >
    <Table columns={columns} dataSource={lists} pagination={false}/>
    <Pagination />
    <NewList
        open={isNew}
        onOk={()=>setIsNew(false)}
        onCancel={()=>setIsNew(false)}
    />
  </Card>
}