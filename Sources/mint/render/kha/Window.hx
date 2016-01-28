package mint.render.kha;

import kha.math.Vector2;
import mint.render.kha.visuals.Triangle;
import mint.render.kha.visuals.Border;
import mint.render.kha.visuals.Visual;
import kha.math.FastMatrix3;
import kha.graphics2.Graphics;
import kha.graphics4.BlendingOperation;
import kha.Color;
import kha.Image;
import mint.core.Macros.*;
import mint.types.Types;

private typedef KhaMintWindowOptions = {
	var color: Null<Color>;
	var color_titlebar: Null<Color>;
	var color_border: Null<Color>;
	var color_collapse: Null<Color>;
}

class Window extends KhaRenderer{

	var window : mint.Window;

	public var color: Color;
	public var color_titlebar: Color;
	public var color_border: Color;
	public var color_collapse: Color;

	var visual : Visual;
	var top : Visual;
	var border : Border;
	var collapse : Triangle;

	public function new( khaRendering : KhaMintRendering, control : mint.Window ) {

		super(khaRendering, control);
		this.window = control;

		var opt : KhaMintWindowOptions = window.options.options;

		color 		   = def(opt.color, Color.fromValue(0xff242424));
		color_border   = def(opt.color_border, Color.fromValue(0xff373739));
		color_titlebar = def(opt.color_titlebar, Color.fromValue(0xff373737));
		color_collapse = def(opt.color_collapse, Color.fromValue(0xff666666));

		var clipRect = window.clip_with;
		visual = new Visual(window.x, window.y, window.w, window.h)
			.color(color);
		top = new Visual(window.title.x, window.title.y, window.title.w, window.title.h)
			.color(color_titlebar);
		border = cast new Border(window.x+1, window.y+1, window.w-1, window.h-1,1)
			.color(color_border);
		var ch = window.collapse_handle;
		collapse = cast new Triangle( ch.x+(ch.w/2), ch.y+(ch.h/2),
			new Vector2(0, 0),
			new Vector2(10, 0),
			new Vector2(5, 10)
		).color(color_collapse);

		window.oncollapse.listen(oncollapse);
	}

	override function onbounds(){
		visual.size(window.w,window.h).pos(window.x,window.y);
		top.size(window.title.w, window.title.h).pos(window.title.x,window.title.y);
		border.size(window.w,window.h).pos(window.x,window.y);
		var ch = window.collapse_handle;
		collapse.size(10,10).pos(ch.x+(ch.w/2), ch.y+(ch.h/2));
	}

	override function onclip(disable : Bool, x : Float, y : Float, w : Float, h : Float){
		visual.size(window.w,window.h).pos(window.x,window.y).clip(x,y,w,h);
		top.size(window.title.w, window.title.h).pos(window.title.x,window.title.y).clip(x,y,w,h);
		border.size(window.w,window.h).pos(window.x,window.y).clip(x,y,w,h);
	}

	override function ondestroy() {
		window.oncollapse.remove(oncollapse);
		super.ondestroy();
	} //ondestroy

	override function onrender(){
		if(!control.visible) return;
		var g : Graphics = khaRendering.frame.g2;
		visual.draw(g);
		top.draw(g);
		border.draw(g);
		if(window.collapsible){
			collapse.draw(g);
		}
		g.flush();
	}

	function oncollapse(doCollapse : Bool){
		visual.size(window.w,window.h).pos(window.x,window.y);
		top.size(window.title.w, window.title.h).pos(window.title.x,window.title.y);
		border.size(window.w,window.h).pos(window.x,window.y);
		collapse.rotation(doCollapse?-Math.PI/2:0);
	}
}
