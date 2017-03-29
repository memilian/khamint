package mint.render.kha;

import kha.math.Vector2;
import mint.render.kha.visuals.Triangle;
import mint.render.kha.visuals.Border;
import mint.render.kha.visuals.Visual;
import mint.render.kha.visuals.Line;
import kha.Color;
import mint.core.Macros.*;

private typedef KhaMintWindowOptions = {
	var color: Null<Color>;
	var color_titlebar: Null<Color>;
	var color_border: Null<Color>;
	var color_collapse: Null<Color>;
	var color_collapse_hover: Null<Color>;
	var color_close: Null<Color>;
	var color_close_hover: Null<Color>;
}

class Window extends KhaRender{

	var window : mint.Window;

	public var color: Color;
	public var color_titlebar: Color;
	public var color_border: Color;
	public var color_collapse: Color;
	public var color_collapse_hover: Color;
	public var color_close: Color;
	public var color_close_hover: Color;

	var visual : Visual;
	var top : Visual;
	var border : Border;
	var collapse : Triangle;
	var closeLine1 : Line;
	var closeLine2 : Line;

	public function new( khaRendering : KhaMintRendering, control : mint.Window ) {

		super(khaRendering, control);
		this.window = control;

		var opt : KhaMintWindowOptions = window.options.options;

		color 		   			= def(opt.color, Color.fromValue(0xff242424));
		color_border   			= def(opt.color_border, Color.fromValue(0xff373739));
		color_titlebar 			= def(opt.color_titlebar, Color.fromValue(0xff373737));
		color_collapse 			= def(opt.color_collapse, Color.fromValue(0xff666666));
		color_collapse_hover 	= def(opt.color_collapse_hover, Color.fromValue(0xff999999));
		color_close 			= def(opt.color_close, Color.fromValue(0xff666666));
		color_close_hover 		= def(opt.color_close_hover, Color.fromValue(0xffdd9999));

		visual = new Visual(this.khaRendering.renderManager, window.x, window.y, window.w, window.h)
			.color(color);

		top = new Visual(this.khaRendering.renderManager, window.title.x, window.title.y, window.title.w, window.title.h)
			.color(color_titlebar);

		border = cast new Border(this.khaRendering.renderManager, window.x+1, window.y+1, window.w-1, window.h-1,1)
			.color(color_border);

		var ch = window.collapse_handle;
		collapse = cast new Triangle(this.khaRendering.renderManager, ch.x+(ch.w/2), ch.y+(ch.h/2),
			new Vector2(0, 0),
			new Vector2(8, 0),
			new Vector2(4, 8)
		).color(color_collapse);

		var cl = window.close_handle;
		closeLine1 = cast new Line(khaRendering.renderManager, cl.x, cl.y, cl.w/2 - 4, cl.h/2 - 4, 8.5, 8.5).color(color_close);
		closeLine2 = cast new Line(khaRendering.renderManager, cl.x, cl.y, cl.w/2 - 4 , cl.h/2 + 4, 8.5, -8.5).color(color_close);

		window.oncollapse.listen(oncollapse);
		window.collapse_handle.onbounds.listen(function(){
			var ch = window.collapse_handle;
			collapse.size(8,8).pos(ch.x+(ch.w/2), ch.y+(ch.h/2));
		});
		window.close_handle.onbounds.listen(function(){
			var cl = window.close_handle;
			closeLine1.pos(cl.x, cl.y);
			closeLine2.pos(cl.x, cl.y);
		});

		window.close_handle.onmouseenter.listen(function(event, control){
			closeLine1.color(color_close_hover);
			closeLine2.color(color_close_hover);
		});
		window.close_handle.onmouseleave.listen(function(event, control){
			closeLine1.color(color_close);
			closeLine2.color(color_close);
		});

		window.collapse_handle.onmouseenter.listen(function(event, control){
			collapse.color(color_collapse_hover);
		});
		window.collapse_handle.onmouseleave.listen(function(event, control){
			collapse.color(color_collapse);
		});
		collapse.visible(window.collapsible ? true : false);
		closeLine1.visible(window.closable ? true : false);
		closeLine2.visible(window.closable ? true : false);
	}

	override function onbounds(){
		visual.size(window.w,window.h).pos(window.x,window.y);
		top.size(window.title.w, window.title.h).pos(window.title.x,window.title.y);
		border.size(window.w,window.h).pos(window.x,window.y);
	}

	override function onclip(disable : Bool, x : Float, y : Float, w : Float, h : Float){
		visual.size(window.w,window.h).pos(window.x,window.y).clip(x,y,w,h);
		top.size(window.title.w, window.title.h).pos(window.title.x,window.title.y).clip(x,y,w,h);
		border.size(window.w,window.h).pos(window.x,window.y).clip(x,y,w,h);
	}

	override function ondestroy() {
		window.oncollapse.remove(oncollapse);
		visual.destroy();
		border.destroy();
		top.destroy();
		collapse.destroy();
		closeLine1.destroy();
		closeLine2.destroy();
		super.ondestroy();
	}

	override function ondepth(d : Float){
		visual.depth = d;
		border.depth = d + 0.0001;
		top.depth = d + 0.0001;
		collapse.depth = d + 0.00015;
		closeLine1.depth = closeLine2.depth = d + 0.00015;
	}

	override function onvisible(visible : Bool){
		visual.visible(visible);
		top.visible(visible);
		border.visible(visible);
		collapse.visible(window.collapsible ? visible : false);
		closeLine1.visible(window.closable ? visible : false);
		closeLine2.visible(window.closable ? visible : false);
	}

	function oncollapse(doCollapse : Bool){
		visual.size(window.w, window.h).pos(window.x, window.y);
		top.size(window.title.w, window.title.h).pos(window.title.x, window.title.y);
		border.size(window.w, window.h).pos(window.x, window.y);
		collapse.rotation(doCollapse? -Math.PI/2 : 0);
	}
}
