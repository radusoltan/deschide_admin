import {Button, Card, Pagination, Space, Table} from "antd";
import {useDeleteRenditionMutation, useGetRenditionsQuery} from "../../../services/images";
import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCirclePlus, faPen, faTrashCan} from "@fortawesome/free-solid-svg-icons";
import {NewRendition} from "../../../components/renditions/NewRenditon";

export const Renditions = () => {
  const [page, setPage] = useState(1)
  const [isNew, setIsNew] = useState(false)
  const {data, isLoading, isSuccess} = useGetRenditionsQuery(page)
  const [deleteRendition] = useDeleteRenditionMutation()


  const renditions = data?.data.map(rendition=>({
    key: rendition.id,
    name: rendition.name,
    dimensions: rendition.width +'x'+rendition.height
  }))

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text,{key}) => (
          <Link to={`/settings/rendition/${key}`}>{text}</Link>
      )
    },
    {
      title: "Dimensions",
      dataIndex: "dimensions",
      key: "dimensions",
      render: (text, {key}) => (<span>{text}</span>)
    },
    {
      render: ({key}) => (<Space>
        <Button
            type="primary"
            danger
            icon={<FontAwesomeIcon icon={faTrashCan} />}
            onClick={()=>{
              deleteRendition(key)
            }}
        />
      </Space>)
    }
  ]

  useEffect(() => {
    if (isSuccess){
      setPage(data.meta.current_page)
    }
  }, [isSuccess]);

  return <Card loading={isLoading} extra={<Space>
    <Button
        type="success"
        icon={<FontAwesomeIcon icon={faCirclePlus} />}
        onClick={()=>setIsNew(true)}
    />
  </Space>}>
    <Table columns={columns} pagination={false} dataSource={renditions} />
    <Pagination
        total={data?.meta.total}
        defaultCurrent={data?.meta.current_page}
        onChange={page=>setPage(page)}
        hideOnSinglePage={true}
    />
    <NewRendition
        open={isNew}
        onOk={()=>setIsNew(false)}
        onCancel={()=>setIsNew(false)}
    />
  </Card>
}