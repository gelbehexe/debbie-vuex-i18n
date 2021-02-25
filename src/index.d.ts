// @ts-ignore
import { Plugin, Store } from "vuex"
// @ts-ignore
import { App } from "@vue/runtime-core/dist/runtime-core"

declare type ContextualLanguageLoaderPromise = Promise<{}>
declare type ContextualLanguageLoader = (contexts: string[]) => ContextualLanguageLoaderPromise
declare type LocalizationLocale = {}

declare type trans = (key:string, replace?: Object) => string
declare type transChoice = (key: string, number: number, replace?: Object) => string
declare type t = trans
declare type addDeferredLocalizationContext = (context: string) => void
declare interface UseTranslationResult {
    trans: trans,
    transChoice: transChoice,
    t: t,
    addDeferredLocalizationContext: addDeferredLocalizationContext
}

export type useTranslation = (store: Store) => UseTranslationResult

declare type getContextualLocalization = (contexts: string[]|string) => Promise<boolean>
declare type loadDeferredLocalization = () => Promise<boolean>

declare interface UseLocalizationContextLoaderResult {
    getContextualLocalization: getContextualLocalization,
    loadDeferredLocalization: loadDeferredLocalization,
}

export type useLocalizationContextLoader = (store: Store) => UseLocalizationContextLoaderResult

export interface VuexTranslationOptions {
    store: Store,
    languageLoader?: ContextualLanguageLoader,
    locale: LocalizationLocale,
    initialTranslations?: Object,
}

export declare interface TranslationPluginType extends Object {
    install?: (app: App, ...options: VuexTranslationOptions[]) => any;
}
export const translationPlugin: TranslationPluginType
