import { boot } from 'quasar/wrappers'
import LanguageSwitcher from 'src/app/components/LanguageSwitcher.vue'

export default boot(({ app }) => {
  // Регистрируем компоненты глобально
  app.component('LanguageSwitcher', LanguageSwitcher)
})