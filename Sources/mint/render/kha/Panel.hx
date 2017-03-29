package mint.render.kha;

import mint.render.kha.visuals.Visual;
import kha.Color;
import mint.core.Macros.*;

private typedef KhaMintPanelOptions = {
	var color: Null<Color>;
}

class Panel extends KhaRender{

	public var panel : mint.Panel;
	public var color : Color;
	public var visual : Visual;

	public function new( khaRendering : KhaMintRendering, control : mint.Panel ) {

		super(khaRendering, control);
		this.panel = control;

		var opt: KhaMintPanelOptions = panel.options.options;

		color = def(opt.color, Color.fromValue(0xff242424));
		visual = new Visual(this.khaRendering.renderManager, control.x, control.y, control.w, control.h).color(color);
	}

	override function ondepth(d : Float){
		visual.depth = d;
	}
	
	override function onvisible(visible : Bool){
		visual.visible(visible);
	}

	override function onbounds(){
		visual.size(control.w,control.h).pos(control.x,control.y);
	}

	override function onclip(disable : Bool, x : Float, y : Float, w : Float, h : Float){
		visual.size(control.w,control.h).pos(control.x,control.y).clip(x,y,w,h);
	}

	override public function ondestroy() {
		visual.destroy();
		super.ondestroy();
	}
}
