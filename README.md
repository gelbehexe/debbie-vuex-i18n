# Debbie Vuex i18n

A simple Localization tool for Vuex/Vue (3)

I created it while developing with Laravel and was facing the problem,
that I do not want load all translations at once.

* uses nearly the same function signatures provided by Laravel.
See [https://laravel.com/docs/8.x/helpers#method-trans](https://laravel.com/docs/8.x/helpers#method-trans)
* contextual loading supported  
* supports deferred loading

> *__This is an experimental version and not indented for production usage yet.__*

## Overview

---
* [Installation](#installation)
* [Usage by Example](#usage-by-example)
  * [Contextual loading (optional)](#contextual-language-loader-optional)
  * [Initialization](#initialization)
  * [Usage in templates](#usage-in-templates)
    * [Inner component](#inner-component)
    * [Outermost component](#outermost-component)
* [Api](#api)
  * [useLocalizationContextLoader](#uselocalizationcontextloaderstore-store-getcontextuallocalization-function-loaddeferredlocalization-function)
    * [getContextualLocalization](#getcontextuallocalizationcontexts-stringstring-promiseboolean)
    * [loadDeferredLocalization](#loaddeferredlocalization-promiseboolean)
  * [useTranslation](#usetranslationstore-store-trans-function-transchoice-function-t-function-adddeferredlocalizationcontext-function)
    * [trans](#transkey-string-replace--string)
    * [transChoice](#transchoicekey-string-number-number-replace--string)
    * [t](#tkey-string-replace--string)
    * [addDeferredLocalizationContext](#adddeferredlocalizationcontextcontext-string)
* [Other](#Other)
  * [Language data examples](#language-data-examples)
    * [Initial data](#initial-data)
    * [Contextual Data](#contextual-data)
---

## Content

### Installation ###

---
```shell
npm i -D @gelbehexe/debbie-vuex-i18n
```

### Usage by Example

#### Contextual language loader (optional)

*This is only required if you want to use contextual loading.*

Create a language loader function e.g. `lib/languageLoader.js`
```javascript
function languageLoader(contexts) {
    return new Promise(function (resolve, reject) { 
        axios.get("/api/localization-context",{
            params: {
                contexts
            }
        }).resolve(data => {
            resolve(data)
        }).catch(err => reject(err))
    })
}
```

#### Initialization

---
In your main script e.g. `app.js` 

```javascript
import { createApp } from 'vue'
import App from './App.vue'

import store from "@/lib/store"; // your configured storage
import { translationPlugin } from "@gelbehexe/debbie-vuex-i18n"

// required only for contextual language loading
import languageLoader from "@/lib/languageLoader";

const app = createApp(App)

app.use(store)

// add plugin to app
app.use(translationPlugin, {
    store,
    languageLoader,
    // your localization languages
    locale: {
        current: "de",
        fallback: "en",
    },
    // Initial translations
    // - for fallback locale only the keys
    //   which are not set in default language 
    //   are needed
    translations: {
        en: {
            en1: "English Only",
        },
        de: {
            key1: "Deutsch 1",
            key2: "Deutsch 2",
            en_de: "Englisch und Deutsch"
        }
    }
})


app.mount('#app')

```

#### Usage in templates

##### Inner component
```vue
<templatep>
  <div>
    <h1>{{ t("key1") }}</h1>
    <p>{{ t("context1.key1"}}</p>
  </div>
</templatep>

<script>
import store from "@/lib/store"; // your configured storage
import { useTranslation } from "@gelbehexe/debbie-vuex-i18n"

export default {
  name: "MyComponent",
  setup() {
    const { t, addDeferredLocalizationContext } = useTranslation(store)
    addDeferredLocalizationContext("context1")
    
    return {
      t
    }
  }
}
</script>

```
#### Outermost component

Use `v-vuex-translation` directive 
to trigger previously deferred context loading.
You can use it without a value or with a method which
is called after loading.

__Important:__ For a dynamic update after contextual loading it 
is necessary that the context is rendered.

```vue
<template>
  <div v-vuex-translation="handleTranslationLoaded">
    <div v-if="loading">Loading ...</div>
    <!-- Important do not use v-else here -->
    <div v-show="!loading">
      <h1>{{ t("key2" }}</h1>
      <slot></slot>
    </div>
  </div>
</template>

<script>
import { ref } from "vue"
import store from "@/lib/store"; // your configured storage
import { useTranslation } from "@gelbehexe/debbie-vuex-i18n"

export default {
  name: "Layout",
  setup() {
    const loading = ref(true)
    
    const { t } = useTranslation(store)
    
    function handleTranslationLoaded() {
      loading.value = false;
    }

    return {
      t,
      loading,
      handleTranslationLoaded
    }
  }
}

</script>
```

### Api

----
#### useLocalizationContextLoader(store: Store): {getContextualLocalization: function, loadDeferredLocalization: function}

Returns the following functions as object:

##### getContextualLocalization(contexts: string[]|string): {Promise<boolean>}

Loads localization contexts directly

##### loadDeferredLocalization(): {Promise<boolean>}

Loads previously added lazy contexts

*If you are using the directive [v-vuex-translation](#v-vuex-translation) contextual 
loading is automatically triggered. Then there is no need for calling this function 
manually*

#### useTranslation(store: Store): {trans: Function, transChoice: Function, t: Function, addDeferredLocalizationContext: Function}

*__Hint:__ Most of the functions are adopted from
[Laravel Localization](https://laravel.com/docs/8.x/localization#introduction),
but not the `__()` because eslint does not like the underscores. __Except:__ The locale parameter is
not available.*

Returns the following functions as object:

##### trans(key: string, replace?: {}): string

Simply translates a string.

See [https://laravel.com/docs/8.x/helpers#method-trans](https://laravel.com/docs/8.x/helpers#method-trans)

##### transChoice(key: string, number: Number, replace?: {}): string

Get a translation according to an integer value.

See [https://laravel.com/docs/8.x/helpers#method-trans-choice](https://laravel.com/docs/8.x/helpers#method-trans-choice)

##### t(key: string, replace?: {}): string

Alias for [trans](#transkey-string-replace--string)

##### addDeferredLocalizationContext(context: string)

Adds a context for deferred loading.

### Directives

For now there is only one directive:

---
#### v-vuex-translation

[comment]: <> (TODO:)

### Other

---
#### Language data examples

You are not required to set all localization keys for fallback language
since they are only used if not defined for default language

##### Initial Data

```json5
    {
        en: {
            en1: "English Only",
        },
        de: {
            key1: "Deutsch 1",
            key2: "Deutsch 2",
            en_de: "Englisch und Deutsch"
        }
    }

```

##### Contextual Data

Data coming from LanguageLoader. Existing keys will be overridden.

For sure this could happen intentionally or accidentally. 

```json5
{
  en: {
    "context1.key3": "Contextual English 3",
  },
  de: {
    "context1.key1": "Context Deutsch 1",
    "context1.key2": "Context Deutsch 2",
    "context1.key4": "Context Deutsch 4",
  },
}
```
