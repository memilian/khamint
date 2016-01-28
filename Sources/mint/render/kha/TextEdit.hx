package mint.render.kha;

import mint.render.kha.visuals.Border;
import kha.Scheduler;
import mint.render.kha.visuals.Visual;
import kha.graphics2.Graphics;
import kha.graphics4.BlendingOperation;
import kha.Color;
import kha.Image;
import mint.core.Macros.*;
import mint.types.Types;

private typedef KhaMintTextEditOptions = {
	var color: Color;
	var color_hover: Color;
	var color_cursor: Color;
    @:optional var cursor_blink_rate: Float;
}

class TextEdit extends KhaRenderer{

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

		visual = new Visual(control.x, control.y, control.w, control.h)
					.color(color);
		cursor = new Visual(0,0,0,0)
					.color(colorCursor)
					.visible(false);
        border = cast new Border(textedit.x,textedit.y, textedit.w, textedit.h, 1)
                    .color(colorCursor);

		textedit.onmouseenter.listen(function(e,c){
			visual.color(colorHover);
		});

		textedit.onmouseleave.listen(function(c,e){
			visual.color(color);
		});

        textedit.onfocused.listen(function(state:Bool) {
            if(state) startCursor(); else stopCursor();
        });

        textedit.onchangeindex.listen(function(index : Int){
            updateCursor();
        });
	}

	public override function onrender() {
		if(!control.visible) return;
		var g : Graphics = khaRendering.frame.g2;
		visual.draw(g);
        if(textedit.isfocused)
            border.draw(g);
        cursor.draw(g);
		g.flush();
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
		var tw = label.font.width(fSize, textedit.edit);
        var twh = tw/2;
        var w = label.font.width(fSize, text);

        var th = label.font.height(fSize);
        var thh = th/2;

        var x = w;
        var y = 0.0;

        x+= textedit.label.x;
        y+= textedit.label.y+2;
        cursor.pos(x,y);
        cursor.size(1,textedit.label.h -8);
	}

	override function ondestroy(){
		stopCursor();

		super.ondestroy();
	}

	override function onvisible(visible : Bool){
		visual.visible(visible);
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
