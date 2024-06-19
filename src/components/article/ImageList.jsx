import {Card, Checkbox, Image, List, Modal, Pagination} from "antd";
import {useAttachImagesToArticleMutation, useGetImagesQuery} from "../../services/images";
import {useState} from "react";

export const ImagesList = ({open, onOk, onCancel, article}) => {
  const [page, setPage] = useState(1)
  const [selectedImages, setSelectedImages] = useState([])

  const {data, isLoading, } = useGetImagesQuery(page)
  const [attachImages, {isSuccess: attachSuccess}] = useAttachImagesToArticleMutation()

  if (attachSuccess) onOk()


  return <Modal
      width={"70%"}
      open={open}
      onOk={()=>{
        attachImages({
          article,
          body: {
            selectedImages
          }
        })
      }}
      onCancel={()=>{
        onCancel()
      }}
  >
    <Card>
      <List
          loading={isLoading}
          dataSource={data?.data}
          renderItem={(image)=> <List.Item
              key={image.id}
              actions={[
                  <Checkbox onChange={()=>setSelectedImages(
                      prevState => ([
                          ...prevState,
                          image.id
                      ]))} />
              ]}
          >
            <List.Item.Meta avatar={
              <Image src={process.env.REACT_APP_URL + image.path + image.name} width={150} />
            } />
          </List.Item>}
      />


      <Pagination
          onChange={(page) => setPage(page)}
          page={data?.meta.current_page}

      />
    </Card>
  </Modal>
}