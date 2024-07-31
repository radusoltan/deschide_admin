import {useDeleteCategoryMutation, useGetCategoriesQuery} from "../../../services/categories";
import {Button, Card, Pagination, Space, Switch, Table} from "antd";
import {useEffect, useState} from "react";
import i18n from "../../../i18n";
import {Link, useNavigate} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faLanguage, faPenToSquare, faSquarePlus, faTrashCan} from "@fortawesome/free-solid-svg-icons";

export const Categories = ()=>{

  const navigate = useNavigate()

  const [locale, setLocale] = useState(i18n.language)
  const [page, setPage] = useState(1)
  const [deleteCategory] = useDeleteCategoryMutation()

  i18n.on('languageChanged', lang => {
    setLocale(lang)
  })

  const {data, isLoading} = useGetCategoriesQuery({page, locale})

  const categories = data?.data.map(category=>({
    key: category.id,
    title: category.title ?? 'No translation',
    in_menu: category.in_menu,
  }))

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text, {key}) => {
        return <Link to={`/content/categories/${key}`}>{text}</Link>
      }
    },
    {
      title: 'In Menu',
      dataIndex: 'in_menu',
      key: 'in_menu',
      render: (text,{key, in_menu}) => (
          <Switch onChange={()=>{}} checked={in_menu} />
      )
    },
    {
      render: ({key}) => <Space>
        <Button
            type="warning"
            icon={<FontAwesomeIcon icon={faPenToSquare} />}
            onClick={()=>{
              navigate(`/content/categories/${key}/edit`)
            }}
        >Edit</Button>
        <Button
            type="info"
            icon={<FontAwesomeIcon icon={faLanguage} />}
            onClick={()=>{
              navigate(`/content/categories/${key}/translate`)
            }}
        >Translate</Button>
        <Button
            danger
            type="primary"
            icon={<FontAwesomeIcon icon={faTrashCan} />}
            onClick={()=>{
              deleteCategory(key)
            }}
        />
      </Space>
    }
  ]

  return <Card
      loading={isLoading}
      extra={<Space>
        <Button
            type="success"
            icon={<FontAwesomeIcon icon={faSquarePlus} />}
            onClick={()=>{
              navigate(`/content/categories/new`)
            }}
        />
      </Space>}
  >
    <Table columns={columns} dataSource={categories} pagination={false} />
    <Pagination
        total={data?.meta.total}
        defaultCurrent={data?.meta.current_page}
        onChange={page=>setPage(page)}
    />
  </Card>
}