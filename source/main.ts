import { ipcRenderer } from "electron"
import * as $ from "jquery"
import { Config, MessageMode } from "../app/both"
import { theme, lang, initAsyncSet } from "./config"

onload = () => {
	// 各个组件的初始化，注意逻辑先后顺序
	let config = initConfig()
	theme.init(config.dark)
	lang.init(config.lang)
	initAsyncSet()
	frame.init()
	timer.display($("#sub"))
	setInterval(() => { timer.display($("#sub")) }, 1000)
}

/** 向后台获取 `Config` 对象，若出错则赋默认值 */
function initConfig() {
	let config = new Config()
	try { config = ipcRenderer.sendSync("config", { mode: MessageMode.get }) } catch {}
	return config
}

/** 有关时间展示的功能 */
module timer {
	/**
	 * 将当前的时间字符串展示在一个 `JQuery` 对象上。
	 * `JQuery` 对象可以用 `$("#xxx")` 获取。
	 * @param node 用于展示的 `JQuery` 对象
	 */
	export function display(node: JQuery) {
		node.text(getString(new Date()))
	}

	/**
	 * 将时间对象所代表的时间转换为时分秒格式的字符串进行展示。
	 * @param time 所需要进行转换的时间对象
	 */
	function getString(time: Date) {
		let hours = time.getHours()
		let minutes = dual(time.getMinutes())
		let seconds = dual(time.getSeconds())
		return hours + ":" + minutes + ":" + seconds
	}

	/**
	 * 将一位的数字变为两位：
	 * 
	 * 显示分钟和秒钟的时候，如果只有一位，将显示的不美观。
	 * 这个函数会过滤一位的数字，将其返回为两位的字符串。
	 * 
	 * 分钟和秒钟的取值范围是 0~59，
	 * 如果不符合这个范围说明发生了错误，
	 * 则会返回空字符串。
	 * 
	 * @param raw 原始的数字
	 */
	function dual(raw: number) {
		if (raw < 60 && raw >= 10) {
			return raw.toString()
		} else if (raw >= 0) {
			return "0" + raw
		} return ""
	}
}

/** 与窗口初始化有关的功能 */
module frame {
	function win(message: string) { ipcRenderer.send("win", message) }
	export function init() {
		var headerHeight: string // css string with "px"
		headerHeight = $("header").css("height")

		$("#min").click(() => { win("min") })
		$("#max").click(() => { win("max") })
		$("#full").click(() => { win("full") })
		$("#close").click(() => { win("close") })
		$("#corner > img").click(() => { win("full") })

		ipcRenderer.on("win", (event, message) => { switch (message) {
			case "max": $("#max > img").attr({src: "static/res.svg"}); break
			case "res": $("#max > img").attr({src: "static/max.svg"}); break

			case "ful":
				$("header").css({display: "none"})
				$("article").css({top: "0px"})
				$("#corner").css({display: "block"})
				$("#border").css({display: "none"})
			break

			case "win":
				$("header").css({display: "block"})
				$("article").css({top: headerHeight})
				$("#corner").css({display: "none"})
				$("#border").css({display: "block"})
		} })
	}
}
