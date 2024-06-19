import {Card, Image, Table} from "antd";
import {useGetImagesQuery} from "../../services/images";
import {useEffect, useState} from "react";
import {Link} from "react-router-dom";

export const MediaLibrary = ()=>{

  const {data, isError, isSuccess } = useGetImagesQuery(1)
  const [images, setImages] = useState([])

  useEffect(() => {
    if (isSuccess){
      setImages(data.data)
    }
    if (isError){

    }
  }, [isSuccess]);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text, {key}) => <Link to={`/media/images/${key}`}>{text}</Link>
    },
    {
      render: (text, {name, path}) => <figure>
        <Image src={path} alt={name} preview={false} width={100}/>
        <figcaption>Fig.1 - Trulli, Puglia, Italy.</figcaption>
      </figure>
    }
  ]

  return <Card>
    <Table columns={columns} dataSource={images.map(image=>({
      key: image.id,
      author: image.author,
      description: image.description,
      path: process.env.REACT_APP_URL + image.path  + image.name,
      name: image.name,
    }))} />
  </Card>
}