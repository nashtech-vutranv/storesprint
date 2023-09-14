import {FC, useState} from 'react'
import i18next from 'i18next'
import {useTranslation} from 'react-i18next'
import TopbarItem from './TopbarItem'

const LanguageToggle: FC = () => {
  const {t} = useTranslation()

  const listLanguageSelected = [
    {id: 1, value: t('header_language_english'), key: 'en'},
    {id: 2, value: t('header_language_france'), key: 'fr'},
  ]

  const [open, setOpen] = useState(false)
  const [currentLanguage, setCurrentLanguage] = useState(
    listLanguageSelected[0].value
  )

  const handleSelectLanguage = (value: string, key: string) => {
    i18next.changeLanguage(key)
    setCurrentLanguage(value)
    setOpen(!open)
  }

  return (
    <div className='p-dropdown dropdown-container'>
      <div
        className='p-dropdown-trigger dropdown-label'
        role='button'
        onClick={() => setOpen(!open)}
      >
        <TopbarItem
          liClassName='p-dropdown-trigger-icon p-clickable'
          buttonClassName='nav-link end-bar-toggle btn btn-link shadow-none'
          iconClassName='dripicons-web noti-icon'
        />
        <span className='dropdown-toggle'>{currentLanguage}</span>
      </div>
      {open && (
        <div className='p-dropdown-panel dropdown-panel'>
          <div className='p-dropdown-items-wrapper' role='listbox'>
            <ul className='p-dropdown-items'>
              {listLanguageSelected.map((language) => (
                <li
                  key={language.key}
                  aria-selected='true'
                  className='p-dropdown-item dropdown-item'
                  role='option'
                  onClick={() =>
                    handleSelectLanguage(language.value, language.key)
                  }
                >
                  {language.value}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

export default LanguageToggle
