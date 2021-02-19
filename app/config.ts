import { fileToObject, saveObject, tomlLang } from "./file"
import { Lang, Config as ConfigRaw } from "./both"

const CONFIG_PATH = "config/config.json"
const STATUS_PATH = "config/status.json"
const LANG_DIR = "lang"

/** 设置 */
export class Config extends ConfigRaw {
	constructor () { super(); fileToObject(CONFIG_PATH, this) }
	save () { saveObject(CONFIG_PATH, this) }
}

/** 窗口的状态：窗口的尺寸和位置 */
export class Status {
	width: number = 900
	height: number = 525
	x: number = 235
	y: number = 125

	constructor () { fileToObject(STATUS_PATH, this) }
	save() { saveObject(STATUS_PATH, this) }
}

/** 语言设置相关的功能 */
export module lang {
	/** 获取配置文件中存在的语言的列表 */
	export function list() { return tomlLang.getList(LANG_DIR) }
	
	/**
	 * 获取指定语言的相应文本
	 * @param name 不包括 `.toml` 的语言名称
	 */
	export function read(name: string) {
		try { return tomlLang.read(LANG_DIR + "/" + name + ".toml") }
		catch {} return undefined
	}
}
