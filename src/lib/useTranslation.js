import { _choose, _makeReplacements } from "./translationHelper"

/**
 *
 * @param {Store} store
 * @return {{t: (function(String, {}=): String), addDeferredLocalizationContext: addDeferredLocalizationContext, transChoice: (function(String, Number, {}=): String), trans: (function(String, {}=): String)}}
 */
export function useTranslation(store) {
    function _getCurrentLocale() {
        return store.getters["debbie-vuex-i18n/localizationCurrentLocale"] || "en"
    }

    function _getFallbackLocale() {
        return store.getters["debbie-vuex-i18n/localizationFallbackLocale"] || "en"
    }

    /**
     * @param {String} locale
     * @return {{}}
     * @private
     */
    function _getTranslationForLocale(locale) {
        return store.getters["debbie-vuex-i18n/localizationTranslations"][locale] || {}
    }

    function _getLine(locale, key) {
        const currentTranslation = _getTranslationForLocale(locale)
        const line = currentTranslation[key]
        if (line !== undefined) {
            return line
        }
        return null
    }

    /**
     *
     * @param {String} key
     * @return {{line: String, locale: String}}
     * @private
     */
    function _getRawTranslation(key) {
        let locale = _getCurrentLocale()
        let line = _getLine(locale, key)
        if (line !== null) {
            return {
                locale,
                line,
            }
        }
        locale = _getFallbackLocale()
        line = _getLine(locale, key)
        if (line !== null) {
            return {
                locale,
                line,
            }
        }
        return {
            locale,
            line: key,
        }
    }

    /**
     * Translates a string
     *
     * @param {String} key
     * @param {{}} [replace]
     * @returns {String}
     */
    function trans(key, replace) {
        const { line } = _getRawTranslation(key)

        return _makeReplacements(line || key, replace)
    }

    /**
     * Get a translation according to an integer value.
     *
     * @param {String} key
     * @param {Number} number
     * @param {{}} [replace]
     * @returns String
     */
    function transChoice(key, number, replace) {
        const { locale, line } = _getRawTranslation(key)

        replace = replace || {}
        // eslint-disable-next-line
        replace["count"] = number

        return _makeReplacements(_choose(locale, line, number), replace)
    }

    /**
     * Alias for @see trans
     *
     * @param {String} key
     * @param {{}} [replace]
     * @returns {String}
     */
    function t(key, replace) {
        return trans(key, replace)
    }

    /**
     * adds a context for deferred loading
     * @param {String} context
     */
    function addDeferredLocalizationContext(context) {
        store.commit("debbie-vuex-i18n/addLazyLanguageLoadingContexts", context)
    }

    return {
        trans,
        transChoice,
        t,
        addDeferredLocalizationContext,
    }
}
