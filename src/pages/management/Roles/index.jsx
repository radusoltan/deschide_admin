import {Button, Card, Space, Table} from "antd";
import {useDeleteRoleMutation, useGetPermissionsQuery, useGetRolesQuery} from "../../../services/users";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCirclePlus, faTrashCan} from "@fortawesome/free-solid-svg-icons";
import {Link} from "react-router-dom";
import {useState} from "react";
import {NewRole} from "./NewRole";

export const Roles = () => {

  const [isNew, setIsNew] = useState(false)
  const {data, isLoading} = useGetRolesQuery()
  const {data: permissions} = useGetPermissionsQuery()
  const [deleteRole] = useDeleteRoleMutation()

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text, {key}) => <Link to={`/management/roles/${key}`}>{text}</Link>
    },
    {
      render: (text, {key}) => <Space>
        <Button
            danger
            type="primary"
            icon={<FontAwesomeIcon icon={faTrashCan} />}
            onClick={()=>deleteRole(key)}
        />
      </Space>
    }
  ]

  const roles = data?.data.map(role=>({
    key: role.id,
    name: role.name,
  }))

  return <Card extra={<Space>
    <Button type="success" icon={<FontAwesomeIcon icon={faCirclePlus} />} onClick={()=>setIsNew(true)} />
  </Space>}>
    <Table columns={columns} pagination={false} dataSource={roles} />
    <NewRole
        open={isNew}
        onOk={()=>{
          setIsNew(false)
        }}
        onCancel={()=>{
          setIsNew(false)
        }}
        permissions={permissions}
    />
  </Card>
}