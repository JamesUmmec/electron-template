import { app, BrowserWindow, ipcMain } from "electron"
import { Config, lang, Status } from "./config";
import { Config as ConfigRaw, ConfigMessage, MessageMode } from "./both"
import { ensureDir } from "./file"
import { ensure } from "./basic"

const CONFIG_DIR = "config"
ensureDir(CONFIG_DIR)
ensure()

let config = new Config()
let status = new Status()

// 创建窗口
let win: BrowserWindow
function createWindow() {
	win = new BrowserWindow({
		width: status.width, height: status.height,
		x: status.x, y: status.y,
		minWidth: 745, minHeight: 525,
		frame: false,
		webPreferences: { nodeIntegration: true }
	}); win.loadFile("main.html")
}

// 窗口控制按钮的响应
ipcMain.on("win", (event, message) => { switch (message) {
	case "min": win.minimize(); break
	case "close":
		// 获取当前窗口的位置和尺寸，并保存在配置文件中
		let size = win.getSize()
		let pos = win.getPosition()
		status.width = size[0]
		status.height = size[1]
		status.x = pos[0]
		status.y = pos[1]
		status.save()

		// 处理好那些保存之后再关闭窗口，否则一旦窗口被关闭，这些对象都会被销毁
		win.close()
	break

	case "max":
		if (win.isMaximized()) {
			win.restore()
			event.sender.send("win", "res")
		} else {
			win.maximize()
			event.sender.send("win", "max")
		}
	break

	case "full":
		if (win.isFullScreen()) {
			win.setFullScreen(false)
			event.sender.send("win", "win")
		} else {
			win.setFullScreen(true)
			event.sender.send("win", "ful")
		}
	break
} })

// 相关设置的前台与后台交互
ipcMain.on("config", (event, message: ConfigMessage) => {
	let reply = new ConfigMessage()
	reply.mode = message.mode

	switch(message.mode) {
		// 获取设置对象
		case MessageMode.get:
			event.returnValue = config as ConfigRaw
		return // return, rather than break

		// 设置主题
		case MessageMode.setDark:
			config.dark = message.value as boolean
			reply.value = config.dark
		break

		// 获取语言列表
		case MessageMode.getLangList:
			event.returnValue = lang.list()
		return // return, rather than break

		// 设置语言（获取语言字符串文本）
		case MessageMode.setLang:
			reply.value = lang.read(message.value as string)
			config.lang = message.value as string
		break
	}

	event.sender.send("config", reply)
})

// 当窗口被关闭的时候，保存完配置文件再退出。
app.on("window-all-closed", () => {
	config.save()

	// 最终执行退出命令，否则程序在后台不会退出。
	app.quit()
})

app.whenReady().then(createWindow)
