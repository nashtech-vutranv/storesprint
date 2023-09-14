import {Link} from 'react-router-dom'
import {Dropdown} from 'react-bootstrap'
import i18next from 'i18next'
import {useTranslation} from 'react-i18next'
import {useEffect, useState} from 'react'
import {useToggle} from '../../../hooks'
import {getCurrentLanguageValue} from '../../../helpers/language'
import {LanguageKey, LanguageValue} from '../../../interface/language'
import {listLanguageSelected} from '../../../constants'
import enFlag from './flags/uk.svg'
import frFlag from './flags/fr.svg'

const LanguageDropdown = () => {
  const {t} = useTranslation()
  const [currentLanguage, setCurrentLanguage] = useState<string>(
    getCurrentLanguageValue()
  )
  const [isOpen, toggleDropdown] = useToggle()

  const handleSelectLanguage = (language: {
    id: number
    value: string
    key: LanguageKey
  }) => {
    i18next.changeLanguage(language.key)
    toggleDropdown()
  }
  const selectedLanguage = localStorage.getItem('i18nextLng')
  useEffect(() => {
    setCurrentLanguage(getCurrentLanguageValue())
  }, [selectedLanguage])

  return (
    <Dropdown show={isOpen} onToggle={toggleDropdown}>
      <Dropdown.Toggle
        variant='link'
        onClick={toggleDropdown}
        className='nav-link dropdown-toggle arrow-none shadow-none'
      >
        <img
          src={
            getCurrentLanguageValue() === LanguageValue.english
              ? enFlag
              : frFlag
          }
          alt={currentLanguage}
          className='me-0 me-sm-1'
          height='12'
          width='20'
        />{' '}
        <span className='align-middle d-none d-sm-inline-block'>
          {currentLanguage}
        </span>
        <i className='mdi mdi-chevron-down d-none d-sm-inline-block align-middle'></i>
      </Dropdown.Toggle>
      <Dropdown.Menu
        align={'end'}
        className='dropdown-menu-animated topbar-dropdown-menu'
      >
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
