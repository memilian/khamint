package mint.render.kha;

import mint.render.kha.visuals.Border;
import mint.render.kha.visuals.Visual;
import kha.Color;
import mint.core.Macros.*;


private typedef KhaMintDropdownOptions = {
	var color : Null<Color>;
	var color_border : Null<Color>;
}

class Dropdown extends KhaRender{

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

		border = cast new Border(this.khaRendering.renderManager, control.x-1, control.y-1, control.w+2, control.h+2,1)
				.color(color_border);
		visual = new Visual(this.khaRendering.renderManager, control.x, control.y, control.w, control.h)
				.color(color);
	}

	override function onvisible(visible : Bool){
		visual.visible(visible);
		border.visible(visible);
	}

	override function ondepth(d : Float){
		visual.depth = d;
		border.depth = d;
	}

	override function onbounds(){
		visual.size(control.w,control.h).pos(control.x,control.y);
		border.size(control.w+2,control.h+2).pos(control.x-1,control.y-1);
	}

	override function onclip(disable : Bool, x : Float, y : Float, w : Float, h : Float){
		visual.size(control.w,control.h).pos(control.x,control.y).clip(x,y,w,h);
		border.size(control.w+2,control.h+2).pos(control.x-1,control.y-1).clip(x,y,w,h);
	}

	override public function ondestroy(){
		visual.destroy();
		border.destroy();
	}

}
