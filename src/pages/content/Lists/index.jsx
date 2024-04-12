import {Button, Card, Pagination, Space, Table} from "antd";
import {useDeleteListMutation, useGetListsQuery} from "../../../services/articles";
import i18n from "../../../i18n";
import {useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCirclePlus, faTrashCan} from "@fortawesome/free-solid-svg-icons";
import {NewList} from "../../../components/lists/NewList";
import {Link} from "react-router-dom";

export const Lists = () => {
  const locale = i18n.language
  const [page, setPage] = useState(1)
  const [isNew, setIsNew] = useState(false)

  const {data, isLoading, isSuccess} = useGetListsQuery({locale, page})
  const [deleteList] = useDeleteListMutation()


  const lists = data?.data.map(list=>({
    key: list.id,
    title: list.title,
  }))

  const columns = [
    {
      title: 'Title',
      dataIndex: "title",
      key: "title",
      render: (text, {key}) => <Link to={`/content/lists/${key}`}>{text}</Link>
    },
    {
      render: (text, {key}) => {

        return (<Space>

          <Button
              danger
              type="primary"
              icon={<FontAwesomeIcon icon={faTrashCan} />}
              onClick={()=>deleteList(key)}
          />
        </Space>)
      }
    }
  ]

  return <Card
      loading={isLoading}
      extra={<Button
          type="success"
          icon={<FontAwesomeIcon icon={faCirclePlus} />}
          onClick={()=>setIsNew(true)}
      />}
  >
    <Table dataSource={lists} columns={columns} pagination={false}/>
    <Pagination
        defaultCurrent={data?.meta.current_page}
        total={data?.meta.total}
        hideOnSinglePage={true}
        onChange={page=>setPage(page)}
    />
    <NewList
        open={isNew}
        onOk={()=>setIsNew(false)}
        onCancel={()=>setIsNew(false)}
    />
  </Card>
}