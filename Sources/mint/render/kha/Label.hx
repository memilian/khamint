package mint.render.kha;


import mint.render.kha.visuals.Visual;
import mint.render.kha.visuals.Text;
import kha.graphics2.Graphics;
import kha.graphics4.BlendingOperation;
import kha.Color;
import kha.Image;
import kha.Font;
import mint.core.Macros.*;
import mint.types.Types;
import mint.Label;


private typedef KhaMintLabelOptions = {
	var color: Null<Color>;
	var color_hover: Null<Color>;
	@optional var font : Font;
}

class Label extends KhaRenderer{

	public var label : mint.Label;
	public var textStr : String;

	public var colorHover : Color;
	public var color : Color;
	public var currentColor : Color;

	public var text : Text;

	public var font : Font;
	public var fontSize : Int;

	public function new( khaRendering : KhaMintRendering, control : mint.Label ) {

		super(khaRendering, control);

		this.label = control;
		this.textStr = label.text;

		var opt: KhaMintLabelOptions = label.options.options;

		font = def(opt.font, khaRendering.font);
		fontSize = Std.int(label.options.text_size);
		color = def(opt.color, Color.White);
		colorHover = def(opt.color_hover, Color.fromValue(0xff9dca63));
		currentColor = color;

		label.onchange.listen(ontext);

		text = cast new Text(control.x, control.y, control.w, control.h, khaRendering.viewportHeight)
					.align(label.options.align, label.options.align_vertical)
					.text(textStr)
					.font(fontSize, font)
					.color(color);

		control.onmouseenter.listen(function(e,c){ text.color(colorHover); });
		control.onmouseleave.listen(function(e,c){ text.color(color); });
	}

	override function ondestroy() {
		label.onchange.remove(ontext);
		super.ondestroy();
	}

	function ontext(str : String){
		this.text.text(str);
	}

	override function onrender(){
		if(!control.visible) return;
		var g : Graphics = khaRendering.frame.g2;
		text.draw(g);
		g.flush();
	}

	override function onclip(disable : Bool, x : Float, y : Float, w : Float, h : Float){
		text.pos(control.x, control.y)
			.size(control.w, control.h)
			.clip(x,y,w,h);
	}

	override function onbounds(){
		text.pos(control.x, control.y)
			.size(control.w, control.h);
	}
}
