import {Card, Col, Row, Image, Modal} from "antd";
import {useCropImageMutation, useGetImageThumbnailsQuery, useGetRenditionsQuery} from "../../services/images";
import {ReactCrop} from "react-image-crop"
import 'react-image-crop/dist/ReactCrop.css'
import {useEffect, useRef, useState} from "react";
import {canvasPreview, centerAspectCrop, useDebounceEffect} from "../../lib/helpers";

export const Cropper = ({image, open, onOk, onCancel}) => {


  const imageRef = useRef(null)
  const previewCanvasRef = useRef(null)

  const [completedCrop, setCompletedCrop] = useState(null)
  const [aspect, setAspect] = useState(null)
  const [crop, setCrop] = useState(null)
  const [rendition, setRendition] = useState(null)
  const {
    data: renditionsData,
    isLoading: renditionsIsLoading,
    isSuccess: renditionsIsSuccess
  } = useGetRenditionsQuery()
  const [cropImage, {isSuccess}] = useCropImageMutation()

  const selectRendition = id => {
    const rendition = renditionsData.find((rendition)=>rendition.id === id)
    setRendition(rendition.id)
    const thumbnail = image.thumbnails.find((thumbnail) => thumbnail.rendition_id === id)

    setAspect(rendition.aspect)

    if(thumbnail.coords === null){
      setCrop(centerAspectCrop(
          image.width,
          image.height,
          rendition.aspect
      ))
    } else {
      setCrop(thumbnail.coords.c)
    }

  }

  const saveCrop = ()=>{

    cropImage({
      image: image.id,
      rendition: rendition,
      crop: {
        p: completedCrop,
        c: crop,
      }
    })
  }



  const thumbnails = image.thumbnails.map(thumbnail=>(<div key={thumbnail.id}>
    <Card
        cover={
          completedCrop && rendition === thumbnail.rendition_id ?
              <canvas ref={previewCanvasRef} /> :
              <Image src={process.env.REACT_APP_URL + thumbnail.path} preview={false} />
        }
        hoverable
        onClick={()=> selectRendition(thumbnail.rendition_id)}
        style={{
          margin: '0 10px 10px 0',
          ...(rendition === thumbnail.rendition_id && {
            background: '#f0f2f5',
            boxShadow: '0 1px 2px -2px rgb(0 0 0 / 16%), 0 3px 6px 0 rgb(0 0 0 / 12%), 0 5px 12px 4px rgb(0 0 0 / 9%)'
          })
        }}
    >
      <Card.Meta
          title={renditionsData?.find(r=>r.id === thumbnail.rendition_id).name}
          // description={}
      />
    </Card>
  </div>))

  const clearState = ()=>{
    setCompletedCrop(null)
    setAspect(null)
    setCrop(null)
    setRendition(null)
  }

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

  return <Modal
      open={open}
      width={'90%'}
      onOk={()=>{
        clearState()
        onOk()
      }}
      onCancel={()=> {
        clearState()
        onCancel()
      }}
  ><Card>
    <Row>
      <Col span={4}>{thumbnails}</Col>
      <Col span={20}>
        <Card>
          <ReactCrop
              onChange={(c, p) => {
                setCrop(c)
                setCompletedCrop(p)
              }}
              onComplete={(c, p) => {
                setCrop(c)
                setCompletedCrop(p)
                saveCrop()
              }}
              crop={crop}
              aspect={aspect}
          >
            <img ref={imageRef} src={process.env.REACT_APP_URL + image.path + image.name} alt=""/>
          </ReactCrop>

        </Card>

      </Col>
    </Row>
  </Card>
  </Modal>
}