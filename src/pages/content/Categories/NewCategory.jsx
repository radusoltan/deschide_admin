import {Button, Card, Form, Input, Switch} from "antd"
import {useAddCategoryMutation} from "../../../services/categories"
import i18n from "../../../i18n"
import {useEffect} from "react";
import {useNavigate} from "react-router-dom";
export const NewCategory = () => {

  const [addCategory, {isSuccess}] = useAddCategoryMutation()
  const navigate = useNavigate()

  useEffect(() => {
    if (isSuccess) navigate("/content/categories")
  }, [isSuccess, navigate]);

  return <Card title="New category">
    <Form
        layout="vertical"
        name="new_category_form"
        initialValues={{
          in_menu: false
        }}
        onFinish={values=>{

          addCategory({body: {...values}, locale: i18n.language})

        }}
    >
      <Form.Item
          label="Title"
          name='title'
          rules={[
            {required:true,message: 'Title is required'}
          ]}
      ><Input /></Form.Item>
      <Form.Item
          label="In Menu"
          name="in_menu"
          valuePropName="checked"
      >
        <Switch defaultChecked={false} />
      </Form.Item>
      <Form.Item
      >
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>

  </Card>
}