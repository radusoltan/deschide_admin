import {Button, Card, Image, Modal, Table, Upload, Pagination} from "antd";
import {useGetImagesQuery, useUploadImageMutation} from "../../services/images";
import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faInbox} from "@fortawesome/free-solid-svg-icons";
const { Dragger } = Upload;

export const MediaLibrary = ()=>{
  const [page, setPage] = useState(1)
  const {data, isError, isSuccess, error } = useGetImagesQuery(page)
  const [images, setImages] = useState([])
  const [isUpload, setIsUpload] = useState(false)
  const [imageList, setImageList] = useState([])
  const [uploadImage, {isSuccess: uploadSuccess}] = useUploadImageMutation()

  const uploadProps = {
    listType: "picture",
    accept: 'image/*',
    onRemove: file => {
      const index = imageList.indexOf(file)
      const newImageList = imageList.slice()
      newImageList.splice(index, 1)
      setImageList(newImageList)
    },
    beforeUpload: file => {
      setImageList([...imageList, file])
      return false
    }
  }

  useEffect(() => {
    if (isSuccess){
      console.log('SS',data.meta.current_page)
      setImages(data.data)
      // setPage(data.meta.current_page)
    }
    if (isError){
      console.dir(error)
    }
    if (uploadSuccess){
      setIsUpload(false)
    }
  }, [isSuccess, uploadSuccess, page]);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text, {key}) => <Link to={`/media/images/${key}`}>{text}</Link>
    },
    {
      render: (text, {name, path, description}) => <figure>
        <Image src={path} alt={name} preview={false} width={100}/>
        <figcaption>{description}</figcaption>
      </figure>
    }
  ]

  return <Card extra={<Button onClick={()=>{
    setIsUpload(true)
  }}>Up</Button>}>
    <Table columns={columns} dataSource={images.map(image=>({
      key: image.id,
      author: image.author,
      description: image.description,
      path: process.env.REACT_APP_URL + image.path  + image.name,
      name: image.name,
    }))} pagination={false} />
    <Pagination
        total={data?.meta.total}
        defaultCurrent={data?.meta.current_page}
        onChange={page=>setPage(page)}
    />
    <Modal
        open={isUpload}
        onOk={()=>{
          const body = new FormData()
          imageList.forEach(file=>body.append('image', file))
          uploadImage(body)
        }}
        onCancel={()=>{}}
    >
      <Card>
        <Dragger {...uploadProps}>
          <p className="ant-upload-drag-icon">
            <FontAwesomeIcon icon={faInbox}/>
          </p>
          <p className="ant-upload-text">Click or drag file to this area to upload</p>
          <p className="ant-upload-hint">
            Support for a single or bulk upload. Strictly prohibited from uploading company data or other
            banned files.
          </p>
        </Dragger>
      </Card>
    </Modal>
  </Card>
}