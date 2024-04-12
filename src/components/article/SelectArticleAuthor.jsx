import {AutoComplete, Card, Modal} from "antd";
import {
  useGetAllAuthorsQuery,
  useGetAuthorsQuery,
  useSearchAuthorMutation,
  useSelectArticleAuthorMutation
} from "../../services/articles";
import {useEffect, useState} from "react";
import i18n from "../../i18n";

export const SelectArticleAuthor = ({open, onOk, onCancel, article}) => {

  const [options, setOptions] = useState()
  const [inputValue, setInputValue] = useState('')
  const [selectedOption, setSelectedOption] = useState({})

  const locale = i18n.language

  const {data, isLoading, isSuccess} = useGetAllAuthorsQuery(locale)
  const [searchAuthor, {data: searchResults, isSuccess: searchSuccess}] = useSearchAuthorMutation()
  const [selectArticleAuthor] = useSelectArticleAuthorMutation()

  const onChange = (data, option) => {

    searchAuthor({
      locale,
      query: data,
    })

    setInputValue(data)
    setSelectedOption(option)
  }
  const onSelect = (data, option) => {

    setInputValue(option.label)
    setSelectedOption(option)
  }

  useEffect(() => {
    if (isSuccess) {
      setOptions(data.data.map(author=>({
        value: String(author.id),
        label: String(author.full_name),
      })))
    }
    if (searchSuccess){
      setOptions(searchResults.data.map(author=>({
        value: String(author.id),
        label: String(author.full_name),
      })))
    }
  }, [isSuccess, searchSuccess]);



  return <Modal
      open={open}
      onOk={()=>{

        selectArticleAuthor({
          article: article,
          body: {
            author: selectedOption.value
          },
        })
        onOk()
      }}
      onCancel={()=>onCancel()}
  >
    <Card>
      <AutoComplete
          value={inputValue}
          options={options}
          onSelect={onSelect}
          onChange={onChange}
          style={{
            width: '100%',
          }}
          placeholder="input here"
      />
    </Card>
  </Modal>
}