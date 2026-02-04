import en from './app/locales/en.json'
import de from './app/locales/de.json'
import it from './app/locales/it.json'
import fr from './app/locales/fr.json'

export default defineI18nConfig(() => ({
  legacy: false,
  locale: 'en',
  messages: {
    en,
    de,
    it,
    fr
  }
}))
