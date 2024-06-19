import {Button, Card, Col, Form, Input, Row} from "antd";
import {useParams} from "react-router-dom";
import {useGetImageQuery, useGetRenditionsQuery, useUpdateImageMutation} from "../../services/images";
import {MediaItemCropper} from "./MediaItemCropper";

export const MediaItem = () => {

  const {image} = useParams()

  const {data, isLoading} = useGetImageQuery(image)
  const {data:renditions} = useGetRenditionsQuery()
  const [updateImage] = useUpdateImageMutation()

  const imageData = data?.data

  const onFinish = values => {

    updateImage({
      image,
      body: {...values}
    })

  }

  return <Card loading={isLoading}>
    <Row>
      <Col span={5}>
        <h2>Used in {imageData?.articles_count} article</h2>

      </Col>
      <Col span={19}>
        <Form
            onFinish={onFinish}
            layout="vertical"
            initialValues={{
              source: imageData?.source,
              author: imageData?.author,
              description: imageData?.description,
            }}
        >
          <Form.Item name="source" label="Source">
            <Input />
          </Form.Item>
          <Form.Item name="author" label="Author">
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>


    <Row>
      {
        renditions?.data.map(rendition => <MediaItemCropper rendition={rendition} image={data?.data} key={rendition.id} />)
      }

    </Row>


  </Card>
}