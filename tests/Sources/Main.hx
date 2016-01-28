package;

import kha.Scheduler;
import kha.System;

class Main {
	public static function main() {
		System.init("kha mint", 800, 600, initialized);
	}

	public static function initialized(){
		var app = new KhaMint();
		System.notifyOnRender(app.render);
		Scheduler.addTimeTask(app.update, 0, 1 / 60);
	}
}