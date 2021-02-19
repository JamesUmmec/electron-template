import { ipcRenderer } from "electron"
import * as $ from "jquery"
import { Lang, ConfigMessage, MessageMode } from "../app/both"

export module theme {
	// 明暗主题样式表
	const DARK_PATH = "dist/web/dark.css"
	const LIGHT_PATH = "dist/web/light.css"
	
	// 明暗主题图标
	const DARK_ICON = "static/dark.svg"
	const LIGHT_ICON = "static/light.svg"

	/**
	 * 初始化的封装：
	 * 
	 * 绑定图片而非外部 `div` 的原因是：
	 * 图片大小和外部 `div` 一致，
	 * 并且图片需要更改 `css` 而外部 `div` 不用。
	 * @param buttonImg 所对应按钮中的图片
	 * @param themeLink 颜色主题所对应的 `css` 链接标签
	 * @param dark 是否初始化为深色主题
	 */
	export function init(dark: boolean) {
		set(dark)
		$("#theme").click(() => {
			dark = !dark
			ipcRenderer.send("config", {mode: MessageMode.setDark, value: dark})
		})
	}

	/**
	 * 设置明暗主题
	 * @param dark 是否是深色主题
	 */
	export function set(dark: boolean) {
		if (dark) {
			$("#theme-css").attr({ href: DARK_PATH })
			$("#theme > img").attr({ src: LIGHT_ICON })
		} else {
			$("#theme-css").attr({ href: LIGHT_PATH })
			$("#theme > img").attr({ src: DARK_ICON })
		}
	}
}

/** 关于语言设置 */
export module lang {
	/** 初始化语言设置的按钮和事件 */
	export function init(name: string) {
		// 初始化语言设置按钮
		var padShow = false // 全局变量
		$("#lang").click(() => {
			if (padShow) {
				// 将原先的列表清空。
				// 本来下一次刷新就要清空的，在这里先清空一道有利于减小内存消耗。
				$("#pad > div").empty()

				$("#pad").css({ display: "none" })
				$("#index").css({
					filter: "none",
					animation: "clear 1000ms"
				})

				padShow = false
			} else {
				getLangList()
				$("#pad").css({ display: "block" })
				$("#index").css({
					filter: "blur(65px)",
					animation: "blur 1000ms"
				})

				padShow = true
			}
		})

		// 设置语言
		set(name)
	}

	/**
	 * 从后台获取相关信息并设置语言
	 * @param languageName 语言名称（语言列表中读取了一个字符串）
	 */
	function set(languageName: string) {
		ipcRenderer.send("config", { mode: MessageMode.setLang, value: languageName })
	}

	/** 通过语言对象设置语言，即改变文本为相应语言 */
	export function apply(lang: Lang) {
		$("title").text(lang.title)
		$("#title").text(lang.title)
		$("#main").text(lang.main)
		$("#theme").attr({ title: lang.light + "/" + lang.dark })
		$("#lang").attr({ title: lang.lang })
	}

	function getLangList() {
		// 获取语言列表
		let list: string[] = []
		try {
			list = ipcRenderer.sendSync(
				"config", { mode: MessageMode.getLangList }
			)
		} catch {}

		// 创建语言列表的展示
		list.forEach((lang) => {
			$("#pad > div").append(generateTag(lang))
		})
	}

	/**
	 * 根据这个语言所对应的原始字符串生成标签
	 * @param raw 这个语言所对应的原始字符串
	 */
	function generateTag(raw: string) {
		let parts = raw.split("-")
		let nameText: string
		let commentText: string
		if (parts.length === 2) {
			nameText = parts[0].trim()
			commentText = parts[1].trim()
		} else if (parts.length === 1) {
			nameText = raw.trim()
			commentText = ""
		} else { return }
		
		let name = $("<div>")
		name.addClass(["lang-name", "line"])
		name.text(nameText)

		let comment = $("<div>")
		comment.addClass(["lang-comment", "line"])
		comment.text(commentText)

		let tag = $("<div>")
		tag.addClass(["lang-tag", "center-col", "btn"])
		tag.append([name, comment])

		// 点击事件
		tag.click(() => {
			// 设置语言
			set(raw)

			// 设置样式
			$(".focus").removeClass("focus")
			tag.addClass("focus")

			// 模拟点击退出语言设置面板
			$("#lang").click()
		})

		return tag
	}
}

/** 异步设置为了保险起见需要等到后台设置完成后前台才体现效果 */
export function initAsyncSet() {
	ipcRenderer.on("config", (event, message: ConfigMessage) => {
		switch (message.mode) {
			case MessageMode.setDark: theme.set(message.value as boolean); break
			case MessageMode.setLang:
				if (message.value) { lang.apply(message.value as Lang) }
			break
		}
	})
}
