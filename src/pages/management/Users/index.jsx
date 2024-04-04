
import {useDeleteUserMutation, useGetRolesQuery, useGetUsersQuery} from "../../../services/users";
import {Button, Card, Pagination, Space, Table} from "antd";
import {useState} from "react";
import {DeleteFilled} from "@ant-design/icons";
import {Link} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUserMinus, faUserPlus} from "@fortawesome/free-solid-svg-icons";
import {NewUser} from "./NewUser";

export const Users = () => {

  const [page, setPage] = useState(1)
  const [isNew, setIsNew] = useState(false)

  const {data, isloading} = useGetUsersQuery(page)
  const {data: roles} = useGetRolesQuery()
  const [deleteUser] = useDeleteUserMutation()

  const users = data?.data.map(user=>({
    key: user.id,
    name: user.name,
    roles: user.roles
  }))

  const columns = [
    {
      title: "Name",
      dataIndex: 'name',
      key: 'name',
      render: (text, {key})=><Link to={`/management/users/${key}`}>{text}</Link>
    },
    {
      title: "Roles",
      dataIndex: 'roles',
      key: 'roles',
      render: roles=>roles.map(role=><span key={role.id}>{role.name}</span>)
    },
    {
      render: ({key})=> {

        return <Space>
          <Button type="primary" danger icon={<FontAwesomeIcon icon={faUserMinus}/>} onClick={()=>{
            deleteUser(key)
          }}/>
        </Space>
      }
    }
  ]



  return <Card
      loading={isloading}
      extra={<Space>
        <Button type="success" icon={<FontAwesomeIcon icon={faUserPlus} />} onClick={()=> {
          setIsNew(true)
        }} />
      </Space>}
  >

    <Table pagination={false} columns={columns} dataSource={users} />

    <Pagination total={data?.total} defaultCurrent={data?.current_page} onChange={page=>setPage(page)} />
    <NewUser
        onOk={()=>setIsNew(false)}
        onCancel={()=>setIsNew(false)}
        roles={roles}
        open={isNew}
    />
  </Card>
}