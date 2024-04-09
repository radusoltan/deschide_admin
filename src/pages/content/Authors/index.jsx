import {Button, Card, Pagination, Space, Table} from "antd";
import {useDeleteAuthorMutation, useGetAuthorsQuery} from "../../../services/articles";
import i18n from "./../../../i18n";
import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {faPenToSquare, faSquarePlus, faTrashCan} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export const Authors = ()=>{

  const navigate = useNavigate()

  const [page, setPage] = useState(1)
  const [locale, setLocale] = useState(i18n.language)

  i18n.on('languageChanged', locale=>setLocale(locale))

  const {data} = useGetAuthorsQuery({page, locale})
  const [deleteAuthor] = useDeleteAuthorMutation()

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, {key}) => (<Link to={`/content/authors/${key}/edit`}>{text}</Link>)
    },
    {
      render: (text,{key})=><Space>
        <Button type="warning" icon={<FontAwesomeIcon icon={faPenToSquare} />} onClick={()=>navigate(`/content/authors/${key}/edit`)} />
        <Button type="info" onClick={()=>navigate(`/content/authors/${key}/translate`)}>Translate</Button>
        <Button type="primary" danger icon={<FontAwesomeIcon icon={faTrashCan} onClick={()=>{
          deleteAuthor(key)
        }} />} />
      </Space>
    }
  ]

  return <Card
      extra={<Space>
        <Button
            type="success"
            icon={<FontAwesomeIcon icon={faSquarePlus} />}
            onClick={()=>navigate(`/content/authors/new`)}
        />
      </Space>}
  >
    <Table columns={columns} dataSource={data?.data.map(author=>({
      key: author.id,
      name: author.full_name,
    }))} pagination={false}/>
    <Pagination
        total={data?.meta.total}
        defaultCurrent={page}
        onChange={page=>setPage(page)}
    />
  </Card>
}