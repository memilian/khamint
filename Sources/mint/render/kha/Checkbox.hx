package mint.render.kha;

import mint.render.kha.visuals.Border;
import mint.render.kha.visuals.Visual;
import kha.graphics2.Graphics;
import kha.Color;
import mint.core.Macros.*;
import mint.types.Types;

private typedef KhaMintCheckboxOptions = {
	var color: Null<Color>;
	var color_hover: Null<Color>;
	var color_node: Null<Color>;
	var color_node_hover: Null<Color>;
}

class Checkbox extends KhaRenderer{

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

		node = new Visual(checkbox.x+4, checkbox.y+4, checkbox.w-8, checkbox.h-8)
				.color(color_node);
		nodeOff = new Visual(checkbox.x+4, checkbox.y+4, checkbox.w-8, checkbox.h-8)
				.color(Color.fromFloats(color_node.R, color_node.G, color_node.B, 0.70));
		visual = new Border(checkbox.x+4,checkbox.y+4,checkbox.w-8,checkbox.h-8, 4)
				.color(color);

		checkbox.onmouseenter.listen(function(e,c) {
			visual.color(color_hover);
			node.color(color_node_hover);
		});
		checkbox.onmouseleave.listen(function(e,c) {
			visual.color(color);
			node.color(color_node);
		});
	}

	public override function onrender(){
		var g : Graphics = khaRendering.frame.g2;
		visual.draw(g);
		if(checkbox.state)
			node.draw(g);
		else
			nodeOff.draw(g);

	}

	override public function ondestroy(){
		super.ondestroy();
	}

	override function onclip(disable : Bool, x : Float, y : Float, w : Float, h : Float){
		node.pos(checkbox.x+4, checkbox.y+4).clip(x,y,w,h);
		nodeOff.pos(checkbox.x+4, checkbox.y+4).clip(x,y,w,h);
		visual.pos(checkbox.x, checkbox.y).clip(x,y,w,h);
		super.onclip(disable,x,y,w,h);
	}
}
