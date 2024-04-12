import {Card, Form, Input, InputNumber, Modal} from "antd";
import {useAddListMutation} from "../../services/articles";
import i18n from "../../i18n";
import {useState} from "react";

export const NewList = ({open, onOk, onCancel}) => {
  const [form] = Form.useForm()
  const [addList] = useAddListMutation()

  const [locale, setLocale] = useState(i18n.language)
  i18n.on('languageChanged', locale=>setLocale(locale))
  return <Modal
      open={open}
      onOk={()=>{
        form.validateFields()
            .then(values=>{
              addList(values)
              form.resetFields()
              onOk()
            })
      }}
      onCancel={onCancel}
  >
    <Card>
      <Form
          form={form}
          layout="vertical"
      >
        <Form.Item
            name="title"
            label="Title"
            rules={[
              {required: true, message: 'Title is required'}
            ]}
        ><Input /></Form.Item>
        <Form.Item
            name="max_item_count"
            label="Maximum Items"
            rules={[
                {required: true, message: 'Maximum Items is required'},
              {type: 'number'}
            ]}
        ><InputNumber/></Form.Item>
      </Form>
    </Card>
  </Modal>
}