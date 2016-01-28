package mint.render.kha;

import mint.render.kha.visuals.Visual;
import kha.Scaler.TargetRectangle;
import kha.graphics2.Graphics;
import kha.graphics4.BlendingOperation;
import kha.Color;
import kha.Image;
import mint.core.Macros.*;
import mint.types.Types;

private typedef KhaMintPanelOptions = {
	var color: Null<Color>;
}

class Panel extends KhaRenderer{

	public var panel : mint.Panel;
	public var color : Color;
	public var visual : Visual;

	public function new( khaRendering : KhaMintRendering, control : mint.Panel ) {

		super(khaRendering, control);
		this.panel = control;

		var opt: KhaMintPanelOptions = panel.options.options;

		color = def(opt.color, Color.fromValue(0xff242424));
		visual = new Visual(control.x, control.y, control.w, control.h).color(color);
	}

	override function onrender(){
		if(!panel.visible) return;
		var g : Graphics = khaRendering.frame.g2;
		visual.draw(g);
	}


	override function onbounds(){
		visual.size(control.w,control.h).pos(control.x,control.y);
	}

	override function onclip(disable : Bool, x : Float, y : Float, w : Float, h : Float){
		visual.size(control.w,control.h).pos(control.x,control.y).clip(x,y,w,h);
	}
}
