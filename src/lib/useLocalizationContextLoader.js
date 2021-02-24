import { getContextualLocalizationUsingStore, loadDeferredLocalizationUsingStore } from "./loader"

export default function useLocalizationContextLoader(store) {
    /**
     * loads localization contexts directly
     *
     * @param {String[]|String} contexts
     * @return {Promise<boolean>}
     */
    function getContextualLocalization(contexts) {
        return getContextualLocalizationUsingStore(store, contexts)
    }

    /**
     * loads previously added lazy contexts
     * @return {Promise<boolean>}
     */
    function loadDeferredLocalization() {
        return loadDeferredLocalizationUsingStore(store)
    }

    return {
        getContextualLocalization,
        loadDeferredLocalization,
    }
}
