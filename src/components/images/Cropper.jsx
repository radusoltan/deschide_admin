import {Card, Modal, Image, Row, Col, notification} from "antd";
import {useEffect, useRef, useState} from "react";
import {useCropImageMutation, useGetAllRenditionsQuery} from "../../services/images";
import {ReactCrop} from "react-image-crop";
import 'react-image-crop/dist/ReactCrop.css'
import {canvasPreview, centerAspectCrop, useDebounceEffect} from "../../lib/helpers";

export const Cropper = ({open, image, onOk, onCancel})=>{
  const imageRef = useRef(null)
  const previewCanvasRef = useRef(null)
  const [completedCrop, setCompletedCrop] = useState(null)
  const [aspect, setAspect] = useState(null)
  const [crop, setCrop] = useState(null)
  const [rendition, setRendition] = useState(null)
  const [thumbnail, setThumbnail] = useState(null)
  const [cropImage, {isSuccess}] = useCropImageMutation()
  const {
    data: renditionsData,
    isLoading: renditionsIsLoading,
    isSuccess: renditionsIsSuccess
  } = useGetAllRenditionsQuery()






  const selectRendition = id => {
    const rend = renditionsData.data.find((r) => r.id === id)
    setRendition(rend.id)
    setAspect(rend.aspect)
    const thumb = image.thumbnails.find(th=>th.rendition_id === rend.id)
    if (thumb.coords === null){
      setCrop(centerAspectCrop(
          image.width,
          image.height,
          rend.aspect
      ))
    } else {
      setCrop(thumb.coords.c)
    }
  }

  const saveCrop = ()=>{
    cropImage({
      image: image.id,
      rendition: rendition,
      thumbnail: thumbnail.id,
      crop: {
        p: completedCrop,
        c: crop,
      }
    })
  }

  const clearState = ()=>{
    setCompletedCrop(null)
    setAspect(null)
    setCrop(null)
    setRendition(null)
  }

  const thumbnails = image.thumbnails.map(thumbnail=>(
      <Card
          key={thumbnail.id}
          cover={
            completedCrop && rendition === thumbnail.rendition_id ?
              <canvas ref={previewCanvasRef}/> :
              <Image src={process.env.REACT_APP_URL + thumbnail.path} preview={false} />
          }
          hoverable
          onClick={()=> {
            setThumbnail(thumbnail)
            selectRendition(thumbnail.rendition_id)
          }}
          style={{
            margin: '0 10px 10px 0',
            ...(rendition === thumbnail.rendition_id && {
              background: '#f0f2f5',
              boxShadow: '0 1px 2px -2px rgb(0 0 0 / 16%), 0 3px 6px 0 rgb(0 0 0 / 12%), 0 5px 12px 4px rgb(0 0 0 / 9%)'
            })
          }}
      >
        <Card.Meta
            title={renditionsData?.data.find(r=>r.id === thumbnail.rendition_id).name}
        />
      </Card>
  ))

  useDebounceEffect(
      async () =>{
        if (
            crop?.width &&
            crop.height &&
            imageRef.current &&
            previewCanvasRef.current
        ){
          canvasPreview(
              imageRef.current,
              previewCanvasRef.current,
              crop,
              1
          )
        }
      }, 100, [crop]
  )

  useEffect(() => {
    if (isSuccess){
      notification.success({
        message: "Salvat"
      })
    }
  }, [isSuccess]);

  return <Modal
      open={open}
      onOk={()=>{
        clearState()
        onOk()
      }}
      onCancel={()=>{
        clearState()
        onCancel()
      }}
      width={'90%'}
  >
    <Card>
      <Row>
        <Col span={4}>{thumbnails}</Col>
        <Col span={20}>
          <Card>
            <ReactCrop
                onChange={(c,p)=>{
                  setCrop(c)
                  setCompletedCrop(p)
                }}
                onComplete={(c,p)=>{
                  setCrop(c)
                  setCompletedCrop(p)
                  saveCrop()
                }}
                crop={crop}
                aspect={aspect}
            >
              <img ref={imageRef} src={process.env.REACT_APP_URL + image.path + image.name} alt={image.name} />
            </ReactCrop>
          </Card>
        </Col>
      </Row>
    </Card>
  </Modal>
}