import {AutoComplete, Input} from "antd";
import {SearchOutlined} from "@ant-design/icons";
import i18n from "../../i18n";
import {useSearchArticlesMutation} from "../../services/articles";
import {useState} from "react";

export const ArticlesSearch = ()=>{
  const [searchOptions, setSearchOptions] = useState([])
  const [searchArticle,{isSuccess: searchIsSuccess, data: searchResults}] = useSearchArticlesMutation()
  const onSearch = (data) => {

    searchResults?.data.filter(article=>{
      const translation = article.translations.find(t=>t.locale === i18n.language)

      return {
        label: translation ? translation.title : '',
        value: String(article.id)
      }
    })
    // console.log('filtered',filtered)

    searchArticle({
      query: data
    })
  }

  return <AutoComplete
      style={{
        width: "100%"
      }}
      options={searchOptions}
      allowClear={true}
      onChange={(data, option)=>{
        console.log(option)
      }}
      onSearch={onSearch}
      onSelect={(data, option)=>{

        navigate(`/content/articles/${data}`)
      }}
      onClear={(data)=>{

      }}
      showSearch={ true }
  >
    <Input prefix={<SearchOutlined />} placeholder="search article" />
  </AutoComplete>
}