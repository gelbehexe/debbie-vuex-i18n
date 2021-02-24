# Debbie Vuex i18n

A simple Localization tool for Vuex/Vue (3)

I created it while developing with Laravel

It uses nearly the same translation function names as defined in laravel.

It also allows lazy loading

This is an experimental version and not indented for production usage yet.

## Overview

---
* [Installation](#Installation)
* [Usage](#Usage)
  * [Contextual loading (optional)](#contextual_language_loader)
  * [Initialization](#Initialization)
  * [Usage in templates](#usage_in_templates)
    * [Inner component](#inner_component)
    * [Outermost component](#outermost_component)
* [Other](#Other)
  * [Language data examples](#language_data_examples)
---

## Content

### Installation ###

```shell
npm i -D @gelbehexe/debbie-vuex-i18n
```

### Usage

#### <a name="contextual_language_loader"></a>Contextual language loader (optional)

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

#### <a name="usage_in_templates"></a>Usage in templates

##### <a name="inner_component"></a>Inner component
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
#### <a name="outermost_component"></a>Outermost component

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


-------------------------
### Other
#### <a name="language_data_examples"></a>Language data examples

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
