package mint.render.kha;

import mint.render.kha.visuals.Border;
import mint.render.kha.visuals.Visual;
import kha.graphics2.Graphics;
import kha.graphics4.BlendingOperation;
import kha.Color;
import kha.Image;
import mint.core.Macros.*;
import mint.types.Types;


private typedef KhaMintDropdownOptions = {
	var color : Null<Color>;
	var color_border : Null<Color>;
}

class Dropdown extends KhaRenderer{

	public var dropdown : mint.Dropdown;

	public var visual : Visual;
	public var border : Border;

	public var color: Color;
	public var color_border: Color;

	public function new( render : KhaMintRendering, control : mint.Dropdown ) {

		super(render, control);
		this.dropdown = control;

		var opt: KhaMintDropdownOptions = dropdown.options.options;

		color = def(opt.color, Color.fromValue(0xff373737));
		color_border = def(opt.color_border, Color.fromValue(0xff121212));

		border = cast new Border(control.x-1, control.y-1, control.w+2, control.h+2,1)
				.color(color_border);
		visual = new Visual(control.x, control.y, control.w, control.h)
				.color(color);
	}

	override function onrender(){
		if(!control.visible) return;
		var g : Graphics = khaRendering.frame.g2;
		visual.draw(g);
		border.draw(g);
		g.flush();
	}

	override function onbounds(){
		visual.size(control.w,control.h).pos(control.x,control.y);
		border.size(control.w+2,control.h+2).pos(control.x-1,control.y-1);
	}

	override function onclip(disable : Bool, x : Float, y : Float, w : Float, h : Float){
		visual.size(control.w,control.h).pos(control.x,control.y).clip(x,y,w,h);
		border.size(control.w+2,control.h+2).pos(control.x-1,control.y-1).clip(x,y,w,h);
	}

}
