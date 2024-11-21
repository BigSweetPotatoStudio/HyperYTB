import data from "./text.json";
let currLang = localStorage.getItem('currLang') || 'zhCN'

let lang = currLang == 'zhCN' ? 'zh' : 'en';

export function setLang(l) {
    lang = l;
}
export function getLang() {
    return lang;
}

let isEffect = false

export function getText(page) {
    if (!data.text[page]) {
        data.text[page] = {}
    }
    return function (t) {
        if (!data.text[page][t]) {
            if (process.env.NODE_ENV == 'development') {
                data.text[page][t] = ''
                isEffect = true
            }
            return t;
        } else {
            return data.text[page][t][lang];
        }
    }
}

if (process.env.NODE_ENV == 'development') {
    localStorage.setItem('lang', JSON.stringify(data))
}
setInterval(() => {
    if (isEffect) {
        let json = JSON.parse(localStorage.getItem('lang') || '{}')
        assign(data.text, json.text)
        localStorage.setItem('lang', JSON.stringify(data))
    }
    isEffect = false
}, 5000)

function assign(obj, target) {
    for (let key in target) {
        let langOBJ = target[key];
        for (let text in langOBJ) {
            if (langOBJ[text] == '' && !(text in obj)) {
                obj[key][text] = langOBJ[text]
            }
        }

    }
}