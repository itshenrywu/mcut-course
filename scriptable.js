const now = new Date,
	timetable = JSON.parse(decodeURIComponent("__DATA__"));
let day = now.getDay();
const date = now.getFullYear() + "_" + (now.getMonth() + 1) + "_" + now.getDate();

function getNext() {
	let e = {
			1: "8:00",
			2: "9:00",
			3: "10:00",
			4: "11:00",
			"4.5": "12:50",
			5: "13:00",
			6: "14:00",
			7: "15:00",
			8: "16:00",
			"8.5": "17:00",
			9: "18:40",
			10: "19:30",
			11: "20:25",
			12: "21:15"
		},
		o = {
			1: "8:50",
			2: "9:50",
			3: "10:50",
			4: "11:50",
			"4.5": "12:50",
			5: "13:50",
			6: "14:50",
			7: "15:50",
			8: "16:50",
			"8.5": "17:50",
			9: "19:25",
			10: "20:15",
			11: "21:10",
			12: "22:00"
		};
	if (void 0 === timetable[day] || !(timetable[day].length >= 0)) return !1;
	for (t of timetable[day]) {
		let l = new Date;
		if (e[t.p.split("-")[1]] && (l.setHours(e[t.p.split("-")[1]].split(":")[0], e[t.p.split("-")[1]].split(":")[1], 0), l >= now)) return (nt = t).st = e[t.s], nt.et = o[t.p.split("-")[1]], nt
	}
}

function createWidget() {
	let w = new ListWidget;
	let gradient = new LinearGradient();
	gradient.locations = [0, 1];
	gradient.colors = [new Color(color[0]), new Color(color[1])];
	w.backgroundGradient = gradient;
	w.backgroundColor = new Color(color[0]);
	let l = getNext();
	if (l) {
		let h = w.addText("下一堂課");
		h.textColor = new Color(color[2]), h.textOpacity = .9, h.font = Font.mediumSystemFont(12), w.addSpacer(8);
		let n = w.addText(l.n);
		n.textColor = new Color(color[2]), n.font = Font.boldSystemFont(16), w.addSpacer(4);
		if (config.widgetFamily === "accessoryRectangular") {
			let d = w.addText(`${l.st} ~ ${l.et}${l.c ? ' / ' + l.c : ''}`);
			d.textColor = new Color(color[2]), d.font = Font.systemFont(10);
		} else {
			let t = w.addText(`${l.st} ~ ${l.et}`);
			t.textColor = new Color(color[2]), t.font = Font.systemFont(14);
			let d = w.addText(l.c || '');
			d.textColor = new Color(color[2]), d.font = Font.systemFont(14);
		}
	} else {
		let i = w.addText("今天沒有課了！");
		i.textColor = new Color(color[2]), i.font = Font.boldSystemFont(18);
	}
	w.url = 'https://mcut-course.com/' + ((l && l.i && l.i.length == 12) ? 'course/' + l.i.substring(0, 4) + '/' + l.i.substring(4, 8) + '/' + l.i.substring(8) : 'my') + '/';
	return w;
}
let widget = createWidget();
config.runsInWidget ? Script.setWidget(widget) : widget.presentMedium(), Script.complete();