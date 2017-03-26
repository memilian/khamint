package;

import kha.Scheduler;
import kha.System;

class Main {
	public static function main() {
		System.init({title:"kha mint", width: 800, height: 600}, function(){
			var app = new KhaMint();
			System.notifyOnRender(app.render);
			Scheduler.addTimeTask(app.update, 0, 1 / 60);
		});
	}
}