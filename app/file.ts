import { mkdirSync, readdirSync, readFileSync, stat, statSync, writeFileSync } from "fs"
import * as toml from "toml"
import { Lang } from "./both"

/**
 * 将文件中的内容读取为对象。
 * 文件路径需由一级目录和文件名称构成。(当然这个地方也只用得到这种)
 * @param path 文件的路径
 */
export function fileToObject(path: string, to: Object) {
	let parts = inCaseWindows(path).split("/")
	if (parts.length === 2) {
		ensureDir(parts[0])
		try { readObject(readFileSync(path, "utf8"), to) } catch {}
	}
}

/**
 * 将对象储存为文件(JSON格式)。
 * 文件路径需由一级目录和文件名称构成。(当然这个地方也只用得到这种)
 * @param path 保存的路径
 * @param from 将这个对象保存
 */
export function saveObject(path: string, from: Object) {
	let parts = inCaseWindows(path).split("/")
	if (parts.length === 2) {
		ensureDir(parts[0])
		try { writeFileSync(path, JSON.stringify(from)) } catch {}
	}
}

/**
 * 在当前目录下确定某一文件夹存在：
 * 
 * 即如果这个文件夹存在则无操作，如果这个文件夹不存在就创建。
 * 这个操作并不是对多层文件夹全部处理，
 * 简单起见，只处理当前目录下的一层文件夹。
 * 文件不用处理，因为读文件的时候若不存在会自动创建。
 * 
 * @param name 文件夹的名称
 */
function ensureDir(name: string) {
	stat(name, (err, info) => {
		if (!info || err) {
			mkdirSync(name)
		}
	})
}

/**
 * 将字符串（JSON格式）中的内容解析为类：
 * 
 * 对于没有的属性不赋值，
 * 这要求这个类需要先初始化赋全默认值后
 * 再参与解析过程。对于多余的属性忽略掉也不赋值。
 * 
 * @param from 初始字符串
 * @param to 所需要读取到的对象
 */
function readObject(from: string, to: Object) {
	let json: {} = JSON.parse(from)
	Object.keys(to).forEach((key) => {
		try { eval("to." + key + "=json." + key) } catch {}
	})
}

/**
 * 防止由于 Windows 操作系统中使用 `\\` 作为路径分隔符号
 * 而 Linux, MacOS 等类 UNIX 操作系统中使用 `/` 作为分隔符号而造成的不同。
 * 同意将分隔符号改为 `/`
 * @param raw 原始字符串
 */
function inCaseWindows(raw: string) {
	return raw.replace(/\\/, "/")
}

/** 读取语言配置文件的时候使用的是 toml 格式，和常用的 json 有所不同 */
export module tomlLang {
	/**
	 * 读取一个目录下所有文件的名称：
	 * 仅获取文件的名称，不获取文件夹。
	 * 并且限定文件类型为 `.toml`
	 * @param path 所对应目录的路径
	 */
	export function getList(path: string) {
		let list: string[] = []
		try {
			let temp = readdirSync(path)
			temp.forEach((name) => {
				try { if(statSync(path + "/" + name).isFile()) {
					if (name.endsWith(".toml") && name.length > ".toml".length) {
						list.push(name.substring(0, name.length - ".toml".length))
					}
				} } catch {}
			})
		} catch { list = [] }
		return list.reverse()
	}

	/**
	 * 将指定路径上的 `toml` 文件读取为 `Lang` 对象
	 * @param path 配置文件的路径
	 */
	export function read(path: string) { try {
		let raw = toml.parse(readFileSync(path, "utf8"))
		let lang = new Lang()

		Object.keys(lang).forEach((para) => { try {
			if (typeof(eval("raw." + para)) === "string") {
				eval("lang." + para + "=raw." + para)
			}
		} catch {} })

		return lang
	} catch (error) { throw error } }
}
