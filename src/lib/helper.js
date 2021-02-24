
/**
 * @param {Store} store
 * @return {ContextualLanguageLoader}
 */
function getLoader(store) {
    return store.getters["debbie-vuex-i18n/languageLoader"]
}

export {
    getLoader,
}
