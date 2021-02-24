const vuexLocalizationStore = {
    namespaced: true,
    state: () => ({
        translations: {},
        loadedContexts: [],
        locale: {
            current: "en",
            fallback: "en",
        },
        lazyContexts: {},
        loader: undefined,
        loading: false,
    }),
    getters: {
        loading(state) {
            return state.loading
        },
        languageLoader(state) {
            return state.loader
        },
        lazyLanguageLoadingContexts(state) {
            return state.lazyContexts
        },
        loadedLocalizationContexts(state) {
            return state.loadedContexts
        },
        localizationCurrentLocale(state) {
            return state.locale.current
        },
        localizationFallbackLocale(state) {
            return state.locale.fallback
        },
        localizationTranslations(state) {
            return state.translations
        },
    },
    mutations: {
        addLocalizationTranslation(state, payload) {
            payload = payload || {}
            for (const k in payload) {
                if (state.translations[k] === undefined) {
                    state.translations[k] = payload[k]
                } else {
                    state.translations[k] = {
                        ...state.translations[k],
                        ...payload[k],
                    }
                }
            }
            // state.translations = {
            //     ...state.translations,
            //     ...payload,
            // }
        },
        addLoadedContext(state, payload) {
            if (Array.isArray(payload)) {
                for (const idx in payload) {
                    state.loadedContexts.push(payload[idx])
                }
            } else {
                state.loadedContexts.push(payload)
            }
        },
        clearLazyLocalizationContexts(state) {
            state.lazyContexts = {}
        },
        setLocalizationLocale(state, payload) {
            state.locale = payload
        },
        addLazyLanguageLoadingContexts(state, payload) {
            state.lazyContexts[payload] = true
        },
        setContextualLanguageLoader(state, payload) {
            state.loader = payload
        },
        setLoading(state, paypload) {
            state.loading = paypload
        },
    },
}

export default vuexLocalizationStore
