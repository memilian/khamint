package mint.render.kha;

import mint.render.kha.visuals.Visual;
import kha.graphics2.Graphics;
import kha.Color;
import kha.Image;
import mint.core.Macros.*;
import mint.types.Types;

private typedef KhaMintButtonOptions = {
	var color: Null<Color>;
	var color_hover: Null<Color>;
	var color_down: Null<Color>;
}

class Button extends KhaRenderer{

	public var visual : Visual;
	public var button : mint.Button;
	public var texture : kha.Image;

	public var color : Color;
	public var color_hover : Color;
	public var color_down : Color;

	public function new( render : KhaMintRendering, control : mint.Button ) {

		super(render, control);
		this.button = control;

		var opt: KhaMintButtonOptions = button.options.options;

		color = def(opt.color, Color.fromValue(0xff373737));
		color_down = def(opt.color_down, Color.fromValue(0xff444444));
		color_hover = def(opt.color_hover, Color.fromValue(0xff445158));

		visual = new Visual(control.x, control.y, control.w, control.h)
			.color(color);

		button.onmouseenter.listen(function(e,c) { visual.color(color_hover); });
		button.onmouseleave.listen(function(e,c) { visual.color(color); });
		button.onmousedown.listen(function(e,c) { visual.color(color_down); });
		button.onmouseup.listen(function(e,c) { visual.color(color_hover); });
	}


	override function onrender(){
		if(!button.visible) return;
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
