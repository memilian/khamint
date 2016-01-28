package mint.render.kha;

import kha.Assets;
import kha.math.Vector4;
import mint.render.kha.visuals.Sprite;
import kha.graphics2.Graphics;
import kha.graphics4.BlendingOperation;
import kha.Color;
import kha.Image;
import mint.core.Macros.*;
import mint.types.Types;

private typedef KhaMintImageOptions = {
	@:optional var uv: Vector4;
	@:optional var color: Color;
	@:optional var image: kha.Image;
	@:optional var sizing: String; //:todo: type
}

class Image extends KhaRenderer{

	public var imageCtrl : mint.Image;
	public var visual : Sprite;
	public var color : Color;

	var ratioW : Float = 1.0;
	var ratioH : Float = 1.0;

	var textureLoaded = false;

	public function new( render : KhaMintRendering, control : mint.Image ) {
		super(render, control);
		imageCtrl = control;

		var opt : KhaMintImageOptions = imageCtrl.options.options;
		color = def(opt.color, Color.fromValue(0xffffffff));
		color = def(opt.color, Color.fromValue(0xffffffff));

		var resourceName = imageCtrl.options.path;

		var texture : kha.Image = null;

		visual = new Sprite(control.x, control.y, control.w, control.h);

		var ontextureloaded = function(image){
			texture = image;

			if(opt.sizing != null){
				switch(opt.sizing){
					case 'fit' :
						if(texture.width > texture.height)
							ratioH = texture.height/texture.width;
						else
							ratioW = texture.width/texture.height;
					case 'cover' :
						var rx = 1.0;
						var ry = 1.0;
						if(texture.width > texture.height)
							rx = texture.height/texture.width;
						else
							ry = texture.width/texture.height;
						opt.uv = new Vector4(0, 0, rx, ry);
				}
			}

			visual = cast new Sprite(control.x, control.y, control.w * ratioW, control.h * ratioH)
			.texture(texture)
			.color(color);

			if(opt.uv != null)
				visual.setUv(opt.uv);

			if(control.clip_with != null)
				visual.clip(control.clip_with.x, control.clip_with.y, control.clip_with.w, control.clip_with.h);

			textureLoaded = true;
		};

		if(Reflect.hasField(Assets.images, resourceName))
			Assets.loadImage(resourceName, ontextureloaded);
		else
			Assets.loadImageFromPath(resourceName,true, ontextureloaded);
		/*if(Loader.the.isImageAvailable(resourceName)){
			texture = Loader.the.getImage(resourceName);
		}else if(opt.image != null){
			texture = opt.image;
		}else{
			trace("No image provided");
		}
		*/


	}

	override function onrender(){
		if(!control.visible || !textureLoaded) return;
		var g : Graphics = khaRendering.frame.g2;
		visual.draw(g);
		g.flush();
	}

	override function onclip(disable : Bool, x : Float, y : Float, w : Float, h : Float){
		visual.clip(x,y,w,h);
	}

	override function onbounds(){
		visual.pos(control.x, control.y)
		.size(control.w, control.h);
	}

	override function ondestroy() {
		visual.ondestroy();
		super.ondestroy();
	}
}
