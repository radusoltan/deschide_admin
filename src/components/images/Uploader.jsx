import {Modal, message, Upload} from "antd";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faInbox} from "@fortawesome/free-solid-svg-icons";
import {useEffect, useState} from "react";
import {useUploadArticleImagesMutation} from "../../services/images";
const { Dragger } = Upload;

export const Uploader = ({ open, article, onOk, onCancel }) => {

  const [imageList, setImageList] = useState([])

  const [uploadArticleImages, {isSuccess, isLoading}] = useUploadArticleImagesMutation()

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
    if (isSuccess) {
      onOk()
    }
  }, [isSuccess]);

  return <Modal
      open={open}
      onCancel={()=>onCancel}
      onOk={()=>{
        const body = new FormData()
        imageList.forEach(file => body.append('images[]', file))
        uploadArticleImages({article,body})

      }}
  >
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

  </Modal>
}