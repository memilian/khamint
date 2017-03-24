package mint.render.kha.visuals;

import kha.Color;
import kha.math.Vector2;
import kha.graphics4.BlendingOperation;
import kha.graphics2.Graphics;

class Triangle extends Visual{

    var p0 : Vector2;
    var p1 : Vector2;
    var p2 : Vector2;
    var center : Vector2;
    var myRotation : Float;

    public function new(x : Float, y : Float, p0 : Vector2, p1 : Vector2, p2 : Vector2){
        super(x,y,0,0);
        this.p0 = p0;
        this.p1 = p1;
        this.p2 = p2;
        this.center = new Vector2(0,0);
        computeCenter();
    }

    public function rotation(rot:Float):Triangle {
        myRotation = rot;
        return this;
    }

    function computeCenter(){
        center = p0.add(p1).add(p2).div(3);
    }

    override public function draw(g : Graphics){
        if(!myVisibility) return;

        g.pushOpacity(myOpacity);
        g.color = myColor;
        g.pushRotation(myRotation, x+center.x, y+center.y);
        g.fillTriangle(x+p0.x, y+p0.y, x+p1.x, y+p1.y, x+p2.x, y+p2.y);
        g.popOpacity();
        g.popTransformation();
    }
}
