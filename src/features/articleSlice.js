import axios from "./../lib/axios";
import i18n from "../i18n";

const token = localStorage.getItem('userToken')
    ? localStorage.getItem('userToken')
    : null

export const lockArticle = article => {
  if (token){
    axios.get(`/articles/${article}/lock?locale=${i18n.language}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }
}

export const unlockArticle = article => {
  if (token){
    axios.get(`/articles/${article}/unlock?locale=${i18n.language}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }
}