import {useState, useEffect} from 'react'
import i18next from 'i18next'
import {useTranslation} from 'react-i18next'
import {Link} from 'react-router-dom'
import {Dropdown} from 'react-bootstrap'
import {listLanguageSelected} from '../../constants/'
import {LanguageKey, LanguageValue} from '../../interface/language'
import {getCurrentLanguageValue} from '../../helpers/language'

const enFlag = require('./flags/uk.jpg')
const frFlag = require('./flags/french.jpg')

const LanguageDropdown = () => {
  const {t} = useTranslation()

  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false)

  const [currentLanguage, setCurrentLanguage] = useState<string>(
    getCurrentLanguageValue()
  )

  const handleSelectLanguage = (language: {
    id: number
    value: string
    key: LanguageKey
  }) => {
    i18next.changeLanguage(language.key)
    toggleDropdown()
  }

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen)
  }

  useEffect(() => {
    setCurrentLanguage(getCurrentLanguageValue())
  }, [localStorage.getItem('i18nextLng')])

  return (
    <Dropdown show={dropdownOpen} onToggle={toggleDropdown}>
      <Dropdown.Toggle
        variant='link'
        id='dropdown-languages'
        onClick={toggleDropdown}
        className='nav-link dropdown-toggle arrow-none shadow-none'
      >
        <img
          src={
            getCurrentLanguageValue() === LanguageValue.english
              ? enFlag
              : frFlag
          }
          alt={getCurrentLanguageValue()}
          className='me-1'
          height='12'
          width='20'
        />{' '}
        <span className='align-middle d-none d-sm-inline-block'>
          {currentLanguage}
        </span>
        <i className='mdi mdi-chevron-down d-none d-sm-inline-block align-middle'></i>
      </Dropdown.Toggle>
      <Dropdown.Menu className='dropdown-menu dropdown-menu-start dropdown-menu-animated topbar-dropdown-menu'>
        <div onClick={toggleDropdown}>
          {listLanguageSelected.map((lang) => {
            const translatedLanguage = {
              ...lang,
              value:
                lang.value === LanguageValue.english
                  ? t('header_language_english')
                  : t('header_language_french'),
            }
            return (
              <Link
                onClick={() => handleSelectLanguage(translatedLanguage)}
                to='#'
                className='dropdown-item notify-item'
                key={translatedLanguage.key}
              >
                <img
                  src={lang.key === LanguageKey.english ? enFlag : frFlag}
                  alt={getCurrentLanguageValue()}
                  className='me-1'
                  height='12'
                  width='20'
                />{' '}
                <span className='align-middle'>{translatedLanguage.value}</span>
              </Link>
            )
          })}
        </div>
      </Dropdown.Menu>
    </Dropdown>
  )
}

export default LanguageDropdown
