import {Button, Card, DatePicker, Space} from "antd"
import moment from "moment"
import {CheckCircleOutlined} from "@ant-design/icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrashCan} from "@fortawesome/free-solid-svg-icons";
import {useDeleteArticlePublishTimeMutation, useSetArticlePublishTimeMutation} from "../../services/articles";
import {useEffect, useState} from "react";

export const SubmitEvents = ({ article, publish_at }) =>{



  const [setArticlePublishTime, {isSuccess: setIsSuccess, data: setData}] = useSetArticlePublishTimeMutation()
  const [deletePublishEvent, {isSuccess: deleteSuccess, data: deleteData}] = useDeleteArticlePublishTimeMutation()

  const [publishTime, setPublishTime] = useState()
  const date = moment(publish_at)

  console.log(date)


  return <Card title="Select publish time" style={{
    marginTop: 25
  }}>
    {publishTime && <Space direction="vertical">
      <div style={{marginBottom: 20}}>
        <div style={{ padding: 5, border: '1px solid #e9e9e9' }}>
          {date.format('MMM DD YYYY kk:mm')}
          <Button
              type="primary"
              danger
              icon={<FontAwesomeIcon icon={faTrashCan} />}
              onClick={()=>deletePublishEvent(article)}
              style={{
                marginLeft: 50
              }}
          />
        </div>
      </div>
    </Space>}
    <Space direction="vertical">
      <DatePicker
          showTime
          onChange={()=>{

          }}
          onOk={date=>{

            setArticlePublishTime({
              article,
              body: {
                time: date.format()
              }
            })
          }}
      />
    </Space>
  </Card>
}