import { getLoader } from "./helper"

/**
 * loads localization contexts directly
 *
 * @param {Store} store
 * @param {String[]|String} contexts
 * @return {Promise<boolean>}
 */
function getContextualLocalizationUsingStore(store, contexts) {
    if (!Array.isArray(contexts)) {
        contexts = [String(contexts)]
    }
    // noinspection JSValidateTypes
    return new Promise((resolve, reject) => {
        const loader = getLoader(store)
        if (loader === undefined) {
            reject(new Error("Loader undefined"))
            return
        }

        const contextParams = []
        const loadedContexts = store.getters["debbie-vuex-i18n/loadedLocalizationContexts"]

        // eslint-disable-next-line
        for (const idx in contexts) {
            // noinspection JSUnfilteredForInLoop
            const context = contexts[idx]
            if (loadedContexts.includes(context)) {
                continue
            }
            contextParams.push(context)
        }

        if (!contextParams.length) {
            resolve(false)
            return
        }
        store.commit("debbie-vuex-i18n/addLoadedContext", contextParams)
        loader(contextParams)
            .then(data => {
                // noinspection JSIncompatibleTypesComparison
                if (data === []) {
                    resolve(false)
                    return
                }
                if (data === undefined) {
                    reject(new Error("No data"))
                    return
                }
                if (typeof data !== "object") {
                    reject(new Error("resolved data needs to be an object or an empty array"))
                    return
                }
                store.commit("debbie-vuex-i18n/addLocalizationTranslation", data)
                resolve(true)
            })
            .catch(err => reject(err))
    })
}

/**
 * loads previously added lazy contexts
 * @param {Store} store
 * @return {Promise<boolean>}
 */
function loadDeferredLocalizationUsingStore(store) {
    const contexts = [...Object.keys(store.getters["debbie-vuex-i18n/lazyLanguageLoadingContexts"])]
    if (!contexts.length) {
        // noinspection JSValidateTypes
        return new Promise(resolve => resolve(false))
    }
    store.commit("debbie-vuex-i18n/clearLazyLocalizationContexts")

    return getContextualLocalizationUsingStore(store, contexts)
}

export {
    getContextualLocalizationUsingStore,
    loadDeferredLocalizationUsingStore,
}
