import vuexLocalizationStore from "./store"

/**
 * @typedef {Function} ContextualLanguageLoader
 * @param {string[]} contexts
 * @return {Promise<{data: {}}>}
 */

/**
 * @typedef {{}} LocalizationLocale
 * @property {String} current
 * @property {String} fallback
 *
 */

/**
 *
 * @param {Store} store
 * @param {ContextualLanguageLoader} loader
 * @private
 */
function _registerLoader(store, loader) {
    store.commit("debbie-vuex-i18n/setContextualLanguageLoader", loader)
}

/**
 * @param {Store} store
 * @private
 */
function _register(store) {
    store.registerModule("vuex-localization", vuexLocalizationStore)
}

/**
 *
 * @param {Store} store
 * @param {LocalizationLocale} locale
 * @private
 */
function _registerLocale(store, locale) {
    if (locale !== null && typeof (locale === "object")) {
        store.commit("debbie-vuex-i18n/setLocalizationLocale", locale)
    }
}

/**
 *
 * @param {Store} store
 * @param {{}} translations
 * @private
 */
function _registerTranslation(store, translations) {
    if (translations !== null && typeof (translations === "object")) {
        store.commit("debbie-vuex-i18n/addLocalizationTranslation", translations)
    }
}

/**
 *
 * @param {Store} store
 * @param {ContextualLanguageLoader} languageLoader
 * @param {LocalizationLocale} locale
 * @param {{}} initialTranslations
 */
function initializeTranslation(store, languageLoader, locale, initialTranslations) {
    _register(store)
    _registerLoader(store, languageLoader)
    _registerLocale(store, locale)
    _registerTranslation(store, initialTranslations)
}

export default initializeTranslation
