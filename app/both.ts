// 这个模块中的内容前台和后台都会引用

/** 出现文本的区域，某种语言所对应的字符串 */
export class Lang  {
	title: string = "未设置语言"
	main: string = "未初始化语言数据"
	light: string = "浅色模式"
	dark: string = "深色模式"
	lang: string = "设置语言"
}

/** 设置 */
export class Config {
	dark: boolean = false
	lang: string = ""
}

/** 设置通信通道传递消息的格式 */
export class ConfigMessage {
	mode: MessageMode
	value: undefined | Config | boolean | string[] | string | Lang
}

/** 传递消息的模式 */
export enum MessageMode {
	get,
	getLangList,
	setDark,
	setLang,
}
