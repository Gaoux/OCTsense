module.exports = {
  useTranslation: () => ({
    t: (key) => key,
    i18n: { changeLanguage: () => new Promise(() => {}) }
  }),
  Trans: ({ children }) => children,
  initReactI18next: {
    type: '3rdParty',
    init: () => {}
  }
};