package mint.render.kha;

import mint.render.kha.visuals.Border;
import mint.render.kha.visuals.Visual;
import kha.Color;
import mint.core.Macros.*;

private typedef KhaMintCheckboxOptions = {
	var color: Null<Color>;
	var color_hover: Null<Color>;
	var color_node: Null<Color>;
	var color_node_hover: Null<Color>;
}

class Checkbox extends KhaRender{

	public var checkbox : mint.Checkbox;

	public var color: Color;
	public var color_hover: Color;
	public var color_node: Color;
	public var color_node_hover: Color;

	var visual : Visual;
	var node : Visual;
	var nodeOff : Visual;

	public function new( khaRendering : KhaMintRendering, control : mint.Checkbox ) {

		super(khaRendering, control);
		this.checkbox = control; 

		var opt: KhaMintCheckboxOptions = checkbox.options.options;

		color = def(opt.color, Color.fromValue(0xff373737));
		color_hover = def(opt.color_hover, Color.fromValue(0xff445158));
		color_node = def(opt.color_node, Color.fromValue(0xff9dca63));
		color_node_hover = def(opt.color_node_hover, Color.fromValue(0xffadca63));

		node = new Visual(this.khaRendering.renderManager, checkbox.x+4, checkbox.y+4, checkbox.w-8, checkbox.h-8)
				.color(color_node);
		nodeOff = new Visual(this.khaRendering.renderManager, checkbox.x+4, checkbox.y+4, checkbox.w-8, checkbox.h-8)
				.color(Color.fromFloats(color_node.R, color_node.G, color_node.B, 0.70));
		visual = new Border(this.khaRendering.renderManager, checkbox.x+4,checkbox.y+4,checkbox.w-8,checkbox.h-8, 4)
				.color(color);

		checkbox.onmouseenter.listen(onmouseenter);
		checkbox.onmouseleave.listen(onmouseleave);
		checkbox.onchange.listen(onchange);
	}

	function onmouseenter(event, control){
		visual.color(color_hover);
		node.color(color_node_hover);
	}

	function onmouseleave(event, control){
		visual.color(color);
		node.color(color_node);
	}

	override function onvisible(visible : Bool){
		visual.visible(visible);
		node.visible(visible);
		nodeOff.visible(visible);
	}

	function onchange(state : Bool, prevState : Bool){
		node.visible(state);
		nodeOff.visible(!state);
	}

	override function ondepth(d : Float){
		visual.depth = d;
		node.depth = d + 0.0001;
		nodeOff.depth = d + 0.0001;
	}

	override public function ondestroy(){
		checkbox.onchange.remove(onchange);
		checkbox.onmouseenter.remove(onmouseenter);
		checkbox.onmouseleave.remove(onmouseleave);
		super.ondestroy();
	}

	override function onclip(disable : Bool, x : Float, y : Float, w : Float, h : Float){
		node.pos(checkbox.x+4, checkbox.y+4).clip(x,y,w,h);
		nodeOff.pos(checkbox.x+4, checkbox.y+4).clip(x,y,w,h);
		visual.pos(checkbox.x, checkbox.y).clip(x,y,w,h);
		super.onclip(disable,x,y,w,h);
	}
}
