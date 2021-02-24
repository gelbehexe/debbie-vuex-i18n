import { nextTick } from "vue"
import initializeTranslation from "./initializeTranslation"
import useLocalizationContextLoader from "./useLocalizationContextLoader"

/**
 * @typedef {{}} VuexTranslationOptions
 * @property {Store} store
 * @property {ContextualLanguageLoader} [languageLoader]
 * @param {LocalizationLocale} locale
 * @property {{}} [initialTranslations]
 */

/**
 *
 * @param {string[]} contexts
 * @return {Promise<{data: {}}>}
 * @private
 */
// eslint-disable-next-line
function _emptyLanguageLoader(contexts) {
    return new Promise(resolve => {
        console.warn("No languageLoader set")
        resolve({ data: {} })
    })
}

const translationPlugin = {
    /**
     * @param app
     * @param {VuexTranslationOptions} options
     */
    install: (app, options) => {
        options = options || {}

        const defaultOptions = {
            store: null,
            languageLoader: _emptyLanguageLoader,
            locale: {},
            translations: {},
        }

        const setupOptions = {
            ...defaultOptions,
            ...options,
        }

        // translation
        initializeTranslation(
            setupOptions.store,
            setupOptions.languageLoader,
            setupOptions.locale,
            setupOptions.translations
        )
        const { loadDeferredLocalization } = useLocalizationContextLoader(setupOptions.store)

        app.directive("vuex-translation", {
            mounted: async(el, binding) => {
                await nextTick()
                let fn
                if (typeof binding.value === "function") {
                    fn = binding.value
                } else {
                    if (typeof fn !== "undefined") {
                        console.warn("Wrong value for directive 'v-vuex-translation', should be empty or a function")
                    }
                    fn = () => {}
                }

                const timeout = window.setTimeout(() => {
                    console.warn("localization value timeout reached")
                }, 6000)

                loadDeferredLocalization()
                    .finally(() => {
                        window.clearTimeout(timeout)
                        fn()
                    })
            },
        })
    },
}

export {
    translationPlugin
}
