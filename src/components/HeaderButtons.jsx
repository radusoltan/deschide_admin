import {Button, Select, Space} from "antd";
import i18n from "../i18n";
import {useDispatch} from "react-redux";
import {logout} from "../features/authSlice";
import {useParams} from "react-router-dom";

export const HeaderButtons = () => {

  const dispatch = useDispatch()
  const {article} = useParams()

  const {Option} = Select

  const handleLogout = () =>{
    dispatch(logout())
  }
  const changeLang = value=>{
    i18n.changeLanguage(value)
  }

  return <div className="header-buttons">
    <Space>
      <Button onClick={handleLogout}>Log Out</Button>
      {
        !article && <Select defaultValue={i18n.language} onChange={changeLang}>
            <Option value="ro">RO</Option>
            <Option value="ru">RU</Option>
            <Option value="en">EN</Option>
          </Select>
      }
    </Space>
  </div>
}