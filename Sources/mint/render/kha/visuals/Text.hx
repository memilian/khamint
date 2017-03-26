package mint.render.kha.visuals;

import kha.System;
import kha.Color;
import kha.graphics4.BlendingOperation;
import kha.Font;
import kha.Image;
import mint.types.Types;
import kha.graphics2.Graphics;

class Text extends Visual{

	var myText : String = "";
	var lines : Array<String>;
	var myAlignementH : TextAlign = TextAlign.left;
	var myAlignementV : TextAlign = TextAlign.center;
	var myFont : Font;
	var fontSize : Int;
	var doWrap = false;

	var viewportHeight : Float;

	public function new(manager : KhaMintRenderManager, x : Float, y : Float, width : Float, height : Float, viewportHeight : Float) {
		super(manager, x,y,width,height);
		this.viewportHeight = viewportHeight;
	}

	function checkLength(){
		if(myFont == null) return;

		var maxLineLength = 0;
		var lineCount = 0;

		if(lines != null){
			lineCount = lines.length;
			for(line in lines){
				if(line.length > maxLineLength)
					maxLineLength = line.length;
			}
		}

		lines = new Array<String>();

		var strLen = myFont.width(fontSize, myText);
		if(!doWrap){
			lines = myText.split('\n');
		}else{
			if(strLen > rw && myFont.width(fontSize, 'a') < rw){
				var len = 0.0;
				var currentLine = "";
				for(i in 0...myText.length){
					var c = myText.charAt(i);
					len += myFont.width(fontSize, c);
					if(len < rw){
						currentLine+=c;
					}else{
						lines.push(currentLine);
						currentLine = c;
						len = myFont.width(fontSize, c);
					}
				}
				if(currentLine.length>0)
					lines.push(currentLine);
			}else {
				lines.push(myText);
			}
		}
	}

	public function text(text : String) : Text{
		this.myText = text;
		checkLength();
		return this;
	}

	public function wrap(doWrap : Bool) : Text{
		this.doWrap = doWrap;
		checkLength();
		return this;
	}

	public function font(size : Int, font : Font) : Text{
		fontSize = size;
		myFont = font;
		checkLength();
		return this;
	}

	override public function clip(x : Null<Float>, y : Null<Float>, w : Null<Float>, h : Null<Float>){
		super.clip(x,y,w,h);
		checkLength();
	}

	public function align(alignH : TextAlign, alignV : TextAlign) : Text{
		myAlignementH = alignH;
		myAlignementV = alignV;
		return this;
	}

	public override function draw(g : Graphics){
		if(!myVisibility) return;

		g.color = myColor;
		g.pushOpacity(myOpacity);
		g.font = myFont;

		var dy = 0.0;
		var lh = myFont.height(fontSize);
		var i = 0;

		if(doClip){
			g.scissor(Std.int(cx),Std.int(cy),Std.int(cw),Std.int(ch));
		}

		for(line in lines){
			var xOff = 0.0;
			var yOff = 0.0;

			switch(myAlignementH){
				case right:
					xOff = rw-myFont.width(fontSize, line);
				case center:
					xOff = rw/2-myFont.width(fontSize, line)/2;
				case _:
			}
			switch(myAlignementV){
				case top | unknown:
					yOff = i*lh;
				case center:
					yOff = this.h/2 - (lines.length % 2 == 0 ? 0 : lh/2) - (Math.floor(lines.length/2))*lh + i*lh;
				case bottom:
					yOff = h-lh-(lines.length-i)*lh;
				case _:
			}

			g.fontSize = fontSize;
			g.drawString(line, x+xOff, y+yOff);
			g.flush();
			dy += lh;
			i++;
		}

		if(doClip){
			g.disableScissor();
		}

		g.flush();
		g.popOpacity();
	}
}
