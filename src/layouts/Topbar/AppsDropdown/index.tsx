import {Link} from 'react-router-dom'
import {Dropdown} from 'react-bootstrap'
import {useToggle} from '../../../hooks'
import {splitArray} from '../../../utils'
import {AppItem} from '../../types'

// get the apps
const apps: AppItem[] = [
  {
    name: 'Slack',
    redirectTo: '#',
  },
  {
    name: 'GitHub',
    redirectTo: '#',
  },
  {
    name: 'Dribbble',
    redirectTo: '#',
  },
  {
    name: 'Bitbucket',
    redirectTo: '#',
  },
  {
    name: 'Dropbox',
    redirectTo: '#',
  },
  {
    name: 'G Suite',
    redirectTo: '#',
  },
]

const AppsDropdown = () => {
  const chunk_size = 3
  const appsChunks = splitArray(apps, chunk_size)
  const [isOpen, toggleDropdown] = useToggle()

  return (
    <Dropdown show={isOpen} onToggle={toggleDropdown}>
      <Dropdown.Toggle
        variant='link'
        id='dropdown-apps'
        as={Link}
        to='#'
        onClick={toggleDropdown}
        className='nav-link dropdown-toggle arrow-none'
      >
        <i className='dripicons-view-apps noti-icon'></i>
      </Dropdown.Toggle>

      <Dropdown.Menu
        align={'end'}
        className='dropdown-menu-animated dropdown-lg p-0'
      >
        <div onClick={toggleDropdown} className='p-2'>
          {appsChunks.map((chunk, index) => (
            <div className='row g-0' key={index.toString()}>
              {chunk.map((item, index1) => (
                <div className='col' key={index1.toString()}>
                  <Link className='dropdown-icon-item' to={item.redirectTo}>
                    <span>{item.name}</span>
                  </Link>
                </div>
              ))}
            </div>
          ))}
        </div>
      </Dropdown.Menu>
    </Dropdown>
  )
}

export default AppsDropdown
