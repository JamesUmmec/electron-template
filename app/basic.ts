// electron 默认的打包方式不带配置文件，这里将其用程序创建出来
import { writeFileSync } from "fs"
import { ensureDir } from "./file"

const LANG_DIR = "lang"

/** 检测是否存在语言配置文件夹如果不存在则创建并写入默认配置 */
export function ensure() {
	if (!ensureDir(LANG_DIR)) {
		create()
	}
}

class LangInfo {
	name: string
	content: string
}

// 多数语言使用网络翻译器翻译，可能有误敬请谅解
// most of the languages are translated by translator via internet.
// there might be mistakes in those translations.
let langList: LangInfo[] = [
	{
		name: "中文 - 现代汉语简体中文",
		content: `
			title = "一个简单的示例"
			main = "建设新世界"
			light = "浅色模式"
			dark = "深色模式"
			lang = "语言设置"
		`
	},
	{
		name: "文言文 - 華夏千古書文言語",
		content: `
			title = "一合行知·知致物格"
			main = "康安海四"
			light = "明"
			dark = "暗"
			lang = "文"
		`
	},
	{
		name: "繁體中文 - 香港特區、澳門特區、臺灣省",
		content: `
			title = "一個簡單的例子"
			main = "世界你好！"
			light = "白晝模式"
			dark = "黯黑模式"
			lang = "語言設置"
		`
	},
	{
		name: "English - US",
		content: `
			title = "A simple demo"
			main = "Hello World!"
			light = "Light mode"
			dark = "Dark mode"
			lang = "Select language"
		`
	},
	{
		name: "Русский - Русский язык",
		content: `
			title = "Простой Пример"
			main = "Привет Мир!"
			light = "Дневной режим"
			dark = "Ночной режим"
			lang = "Настройки языка"
		`
	},
	{
		name: "Deutsch - Deutschland, Österreich",
		content: `
			title = "ein einfaches Beispiel"
			main = "Hallo Welt!"
			light = "Hellfarbener Modus"
			dark = "Dunkler Modus"
			lang = "Einstellungen der Sprache"
		`
	},
	{
		name: "日本語 - にほんご",
		content: `
			title = "簡単な例"
			main = "おはよう、世界!"
			light = "明るい色モード"
			dark = "暗いモード"
			lang = "言語の設定"
		`
	},
	{
		name: "조선어 - 조선",
		content: `
			title = "간단한 예"
			main = "안녕하세요 세계!"
			light = "밝은 색 패턴"
			dark = "어두운 색 패턴"
			lang = "언어 선택"
		`
	},
	{
		name: "Français - France",
		content: `
			title = "Un exemple simple"
			main = "Bonjour, le monde!"
			light = "Mode lumière"
			dark = "Mode foncé"
			lang = "Paramètres linguistiques"
		`
	},
	{
		name: "English - UK",
		content: `
			title = "A simple demo"
			main = "Hello World!"
			light = "Light mode"
			dark = "Dark mode"
			lang = "Select language"
		`
	},
	{
		name: "Ελληνικά - Ελλάδα",
		content: `
			title = "ένα απλό παράδειγμα"
			main = "Γειά σου Κόσμε!"
			light = "Φωτεινή λειτουργία"
			dark = "Σκοτεινή λειτουργία"
			lang = "Επιλέξτε μια γλώσσα"
		`
	},
	{
		name: "عربي - عربي",
		content: `
			title = "مثال بسيط"
			main = "مرحبا بالعالم"
			light = "سطع"
			dark = "أغمق"
			lang = "اختر لغة"
		`
	},
	{
		name: "עִברִית - ישראל",
		content: `
			title = "דוגמה פשוטה"
			main = "שלום עולם"
			light = "מצב בהיר"
			dark = "מצב כהה"
			lang = "בחר שפה"
		`
	},
	{
		name: "བོད་སྐད། - མཛེས་སྡུག་ལྡན་པའི་མཚོ་བོད་མཐོ་སྒང།",
		content: `
			title = "ཨོཾ་མ་ཎི་པད་མེ་ཧཱུྃ།"
			main = "བཀྲ་ཤིས་བདེ་ལེགས།"
			light = "ཉིན་དཀར་གྱི་མ་དཔེ།"
			dark = "མཚན་མོ་འི་མ་དཔེ།"
			lang = "སྐད་ཆ་འི་བཀོད་སྒྲིག།"
		`
	}
]

/** 语言默认配置的写入 */
function create() {
	langList.forEach((langInfo) => { try {
		writeFileSync(
			LANG_DIR + "/" + langInfo.name + ".toml",
			langInfo.content.replace(/\t/g, "").trim()
		)
	} catch {} })
}
