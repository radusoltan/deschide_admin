import {Col, Image} from "antd";
import {ReactCrop} from "react-image-crop";
import 'react-image-crop/dist/ReactCrop.css'
import {centerAspectCrop} from "../../lib/helpers";
import {useCropImageMutation} from "../../services/images";
import {useEffect, useState} from "react";

export const MediaItemCropper = ({rendition, image}) => {



  const imageUrl = process.env.REACT_APP_URL + image?.path + image?.name

  const thumbnail = image.thumbnails.find(t=>t.rendition_id===rendition.id)

  const defaultCrop = centerAspectCrop(
    image.width,
    image.height,
    rendition.aspect
  )



  const [cropImage] = useCropImageMutation()

  const [crop, setCrop] = useState(null)

  useEffect(() => {

    if (thumbnail.crop === null){
      setCrop(defaultCrop)
    }


    // setCrop(
    //     thumbnail ? JSON.parse(thumbnail.coords).p : defaultCrop
    // )
  }, []);

  return <Col span={12} key={rendition?.id}>
    <h1>{rendition.name}</h1>
    <ReactCrop
        onChange={(c)=>{
          setCrop(c)
        }}
        onComplete={(c,p)=>{
          setCrop(c)
          cropImage({
            image: image.id,
            rendition: rendition.id,
            thumbnail: thumbnail?.id,
            crop: {
              c,
              p
            }
          })
        }}
        crop={crop}
        aspect={rendition.aspect}
    >
      <Image src={imageUrl} preview={false} width={400}/>
    </ReactCrop>

      {/*// <Image src={process.env.REACT_APP_URL + imageThumbnail?.path} preview={false} width={200}/>*/}

  </Col>
}