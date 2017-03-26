package mint.render.kha.visuals;

import kha.graphics4.BlendingOperation;
import kha.graphics2.Graphics;
import kha.math.Vector4;
import kha.Image;

class Sprite extends Visual{

    var myTexture : Image;
    var uv : Vector4;

    public function new(manager : KhaMintRenderManager, x : Float, y : Float, width : Float, height : Float) {
        super(manager, x,y,width,height);
        uv = new Vector4(0,0,1,1);
    }

    public function texture(tex : Image) : Sprite{
        if(myTexture != null)
            myTexture.unload();
        myTexture = tex;
        return this;
    }

    public function setUv(uv : Vector4) : Sprite{
        this.uv = uv;
        return this;
    }

    override public function draw(g:Graphics) {
        if(!myVisibility || myTexture == null) return;
        g.pushOpacity(myOpacity);
        g.color = myColor;
        if(doClip){
            g.scissor(Std.int(cx),Std.int(cy),Std.int(cw),Std.int(ch));
        }else{
            g.scissor(Std.int(x),Std.int(y),Std.int(w),Std.int(h));
        }
        g.drawScaledImage(myTexture,x,y,uv.z*w, uv.w*h);
        g.disableScissor();
        g.popOpacity();
    }

    public function ondestroy(){
        renderManager.removeVisual(this);
        if(myTexture != null)
            myTexture.unload();
    }


}
