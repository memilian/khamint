package mint.render.kha;

import mint.render.kha.visuals.Visual;
import kha.graphics2.Graphics;
import kha.graphics4.BlendingOperation;
import kha.Color;
import kha.Image;
import mint.core.Macros.*;
import mint.types.Types;


private typedef KhaMintProgressOptions = {
	var color: Null<Color>;
	var color_bar: Null<Color>;
}

class Progress extends KhaRenderer{

	public var progress : mint.Progress;

	public var color : Color;
	public var colorBar : Color;

	public var visual : Visual;
	public var bar : Visual;

	var margin : Float = 2.0;

	public function new( render : KhaMintRendering, control : mint.Progress ) {

		super(render, control);
		this.progress = control;

		var opt: KhaMintProgressOptions = progress.options.options;

		color = def(opt.color, Color.fromValue(0x242424));
		colorBar = def(opt.color_bar, Color.fromValue(0x9dca63));

		visual = new Visual(control.x, control.y, control.w, control.h)
					.color(color);
		bar = new Visual(control.x+margin, control.y+margin, getBarWidth(progress.progress), control.h - (margin*2))
					.color(colorBar);

		progress.onchange.listen(onprogresschange);
	}

	public override function ondestroy() {
		progress.onchange.remove(onprogresschange);
		super.ondestroy();
	}

	override function onrender(){
		if(!control.visible) return;
		var g : Graphics = khaRendering.frame.g2;
		visual.draw(g);
		bar.draw(g);
		g.flush();
	}


	function onprogresschange(cur, prev){
		bar.size(getBarWidth(cur), control.h-(margin*2));
	}

	function getBarWidth(progressValue:Float) {
		var width = (control.w-(margin*2)) * progressValue;
		if(width <= 1) width = 1;
		var controlW = (control.w - margin);
		if(width >= controlW) width = controlW;
		return width;
	}

	override function onclip(disable : Bool, x : Float, y : Float, w : Float, h : Float){
		visual.pos(control.x, control.y)
		.size(control.w, control.h)
		.clip(x,y,w,h);

		bar.pos(control.x+margin, control.y+margin)
		.size(getBarWidth(progress.progress), control.h-(margin*2))
		.clip(x,y,w,h);
	}

	override function onbounds(){
		visual.pos(control.x, control.y)
		.size(control.w, control.h);
		bar.pos(control.x+margin, control.y+margin)
		.size(getBarWidth(progress.progress), control.h-(margin*2));
	}
}

