package mint.render.kha;

import mint.render.kha.visuals.Border;
import kha.Scheduler;
import mint.render.kha.visuals.Visual;
import kha.Color;
import mint.core.Macros.*;

private typedef KhaMintTextEditOptions = {
	var color: Null<Color>;
	var color_hover: Null<Color>;
	var color_cursor: Null<Color>;
    @:optional var cursor_blink_rate: Float;
}

class TextEdit extends KhaRender{

	public var textedit : mint.TextEdit;
	public var visual : Visual;
	public var cursor : Visual;
    public var border : Border;

	public var color: Color;
	public var colorHover: Color;
    public var colorCursor: Color;
    public var cursorBlinkRate: Float;

	public function new( render : KhaMintRendering, control : mint.TextEdit ) {

		super(render, control);

		textedit = control;

		var opt: KhaMintTextEditOptions = textedit.options.options;

		color = def(opt.color, Color.fromValue(0xff646469));
		colorHover = def(opt.color_hover, Color.fromValue(0xff444449));
		colorCursor = def(opt.color_cursor, Color.fromValue(0xff9dca63));
        cursorBlinkRate = def(opt.cursor_blink_rate, 0.5);

		visual = new Visual(this.khaRendering.renderManager, control.x, control.y, control.w, control.h)
					.color(color);
		cursor = new Visual(this.khaRendering.renderManager, 0,0,0,0)
					.color(colorCursor)
					.visible(false);
        border = cast new Border(this.khaRendering.renderManager, textedit.x,textedit.y, textedit.w, textedit.h, 1)
					.color(colorCursor).visible(false);

		textedit.onmouseenter.listen(onmouseenter);
		textedit.onmouseleave.listen(onmouseleave);
        textedit.onfocused.listen(onfocused);
        textedit.onchangeindex.listen(onchangeindex);
	}
	
	function onchangeindex(index : Int){
		updateCursor();
	}

	function onfocused(state : Bool){
		if(state){
			startCursor();
			border.visible(true);
		} else {
			stopCursor();
			border.visible(false);
		}
	}

	function onmouseleave(event, control){
		visual.color(color);
	}

	function onmouseenter(event, control){
		visual.color(colorHover);
	}

	override function ondepth(d : Float){
		visual.depth = d;
		border.depth = d + 0.01;
		cursor.depth = d + 0.01;
	}

	var blinkTaskId : Int = -1;
	function startCursor(){
		cursor.visible(true);
		updateCursor();
		blinkTaskId = Scheduler.addTimeTask(blinkCursor, 0,cursorBlinkRate,0);
	}

	function stopCursor(){
		cursor.visible(false);
		Scheduler.removeTimeTask(blinkTaskId);
		blinkTaskId = -1;
	}

	function blinkCursor(){
		if(blinkTaskId == -1 ) return;
		cursor.visible(!cursor.isVisible());
	}

	function updateCursor(){
		var label : mint.render.kha.Label = cast textedit.label.renderer;

		var fSize = label.fontSize;

		var text = textedit.before_display(textedit.index);
		var w = label.font.width(fSize, text);

        var x = w;
        var y = 0.0;

        x+= textedit.label.x;
        y+= textedit.label.y + 2;
        cursor.pos(x,y);
        cursor.size(1,textedit.label.h -8);
	}

	override function ondestroy(){
		stopCursor();
		textedit.onfocused.remove(onfocused);
		textedit.onmouseenter.remove(onmouseenter);
		textedit.onmouseleave.remove(onmouseleave);
		textedit.onchangeindex.remove(onchangeindex);
		visual.destroy();
		cursor.destroy();
		border.destroy();
		super.ondestroy();
	}

	override function onvisible(visible : Bool){
		visual.visible(visible);
		if(control.isfocused)
			border.visible(visible);
		if(!visible){
			stopCursor();
		}else if(visible && textedit.isfocused){
			startCursor();
		}
	}

    override function onclip(disable : Bool, x : Float, y : Float, w : Float, h : Float){
        visual.pos(control.x, control.y)
        .size(control.w, control.h)
        .clip(x,y,w,h);
        border.pos(control.x, control.y)
        .size(control.w, control.h)
        .clip(x,y,w,h);
        updateCursor();
    }

    override function onbounds(){
        visual.pos(control.x, control.y)
        .size(control.w, control.h);
        border.pos(control.x, control.y)
        .size(control.w, control.h);
        updateCursor();
    }

}
