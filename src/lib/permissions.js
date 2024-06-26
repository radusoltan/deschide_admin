import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faAddressBook, faGears,
  faHandSparkles, faImages,
  faNewspaper, faPencil,
  faPenFancy,
  faPeopleGroup, faRectangleList,
  faUsers,
} from '@fortawesome/free-solid-svg-icons'

export const getUserMenu = permissions => {

  const names = permissions.map(({name})=>(name))

  return [
    getItem('Dashboard','/'),
    getItem('Content','/content', <FontAwesomeIcon icon={faNewspaper} />,[
      names.includes('category-list') && getItem('Categories','/content/categories', <FontAwesomeIcon icon={faPenFancy} />),
      // names.includes('article-list') && getItem('Articles','/content/articles'),
      names.includes('author-list') && getItem('Authors','/content/authors', <FontAwesomeIcon icon={faPencil} />),
      names.includes('list-list') && getItem('Lists','/content/lists', <FontAwesomeIcon icon={faRectangleList} />)
    ]),
    getItem('Management','/management',<FontAwesomeIcon icon={faUsers} />, [
      names.includes('user-list') && getItem('Users','/management/users', <FontAwesomeIcon icon={faPeopleGroup} />),
      names.includes('role-list') && getItem('Roles','/management/roles', <FontAwesomeIcon icon={faAddressBook} />),
      names.includes('list-list') && getItem('Permissions','/management/permissions', <FontAwesomeIcon icon={faHandSparkles} />),
    ]),
    getItem('Media','/media',<>ICON</>,[
        getItem('Images','/media/images')
    ]),
    getItem('Settings', '/settings',<FontAwesomeIcon icon={faGears} />,[
        getItem('Renditions','/settings/renditions',<FontAwesomeIcon icon={faImages} />,)
    ])
  ]



}

const getItem = (label, key, icon, children, type) => {
  return {
    key,
    icon,
    children,
    label,
    type,
  }
}