import {Button, Card, Divider, Form, Input, InputNumber, Space} from "antd";
import {useNavigate, useParams} from "react-router-dom";
import {useGetRenditionQuery, useUpdateRenditionMutation} from "../../services/images";
import {useEffect, useState} from "react";
import { Image } from "antd"


export const EditRendition = (props) => {

  const {rendition} = useParams();
  const navigate = useNavigate();

  const {data, isLoading, isSuccess} = useGetRenditionQuery(rendition)
  const [updateRendition, {isSuccess: updateIsSuccess}] = useUpdateRenditionMutation()
  const [renditionData, setRenditionData] = useState({})
  useEffect(() => {
    if (isSuccess) {
      setRenditionData(data.data)

    }
    if (updateIsSuccess){
      navigate('/settings/renditions')
    }
  }, [isSuccess, updateIsSuccess]);

  const onFinish = values => {

    setRenditionData(prevState=> {
      return {
        ...prevState,
        ...values,
        aspect: values.width / values.height
      }
    })

  }

  return <Card loading={isLoading} title={`Edit Rendition: ${renditionData.name}`}>
<Space direction="vertical">
    <Input
        type="text"
        placeholder={`Name`}
        value={renditionData.name}
        onChange={(e)=>{
          setRenditionData(prevState => ({
            ...prevState,
            name: e.target.value,
          }))
        }}
    /><Divider/>

    <InputNumber
        value={renditionData.width}
        onChange={(e)=>{
          console.log(e)
          setRenditionData(prevState => ({
            ...prevState,
            width: e,
          }))
        }}
    />

    <InputNumber
        value={renditionData.height}
        onChange={(e)=>{
          setRenditionData(prevState => ({
            ...prevState,
            height: e
          }))
        }}
    />

    <Button type="primary" onClick={()=>{
      updateRendition({
        rendition: renditionData.id,
        body: {
          width: renditionData.width,
          height: renditionData.height,
          name: renditionData.name,
        }
      })
    }}>
      Submit
    </Button>

    <Image
        src={`https://dummyimage.com/${renditionData.width}x${renditionData.height}/bdbdbd/5e5e5e&text=${renditionData.name}+-+${renditionData.width}+x+${renditionData.height}`}
        preview={false}
        style={{
          margin: "0 auto",
        }}
    /></Space>
  </Card>
}