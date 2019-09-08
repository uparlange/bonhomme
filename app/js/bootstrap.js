import ApplicationManager from "./classes/ApplicationManager.js";

ApplicationManager.getInstance().init({
	width: ApplicationManager.STAGE_W,
	height: ApplicationManager.STAGE_H,
	antialiasing: true,
	transparent: false,
	backgroundColor: 0xFFFFFF,
	resolution: 1
});