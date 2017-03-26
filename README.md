
A Kha backend for [snowkit's mint library](https://github.com/snowkit/mint)

See [the demo here](http://memilian.github.io/khamint/demo/)

Currently only works on html5 target


minimal setup :
```haxe
package;

import kha.graphics2.Graphics;
import kha.input.Keyboard;
import kha.input.Mouse;
import kha.Assets;
import kha.Key;
import kha.Font;
import mint.Canvas;
import mint.layout.margins.Margins;
import mint.focus.Focus;
import mint.render.kha.KhaMintAdapter;
import mint.render.kha.KhaMintRendering;
import kha.Framebuffer;
import kha.Scheduler;
import kha.System;

class Main {
    public static function main() {
        var main = new Main();
        System.init("kha mint minimal", 800, 600, function(){
            System.notifyOnRender(main.render);
            Scheduler.addTimeTask(main.update, 0, 1 / 60);
        });
    }

    public function new():Void {
        Assets.loadEverything(init);
    }


    var canvas: Canvas;
    var rendering: KhaMintRendering;
    var kmAdapter : KhaMintAdapter;
    var layout: Margins;
    var focus: Focus;

    var font : Font;

    public function init():Void {

        Keyboard.get(0).notify(onkeydown, onkeyup);
        Mouse.get(0).notify(onmousedown, onmouseup, onmousemove, onmousewheel);

        //used to convert kha events to mint events
        kmAdapter = new KhaMintAdapter();

        font = Assets.fonts.yourFont;

        rendering = new KhaMintRendering({
            font:font
        }, System.pixelWidth, System.pixelHeight);

        layout = new Margins();

        canvas = new mint.Canvas({
            name:'canvas',
            rendering: rendering,
            renderable:true,
            x: 0, y:0, w: System.pixelWidth, h: System.pixelHeight
        });

        focus = new Focus(canvas);
    }

    public function render(frame : Framebuffer):Void {
        var g : Graphics = frame.g2;

        g.begin(true);
        rendering.renderManager.render(g);
        g.flush();
        g.end();
    }

    var dt=0.0;
    var lastTime = Scheduler.time();
    public function update() {
        dt = Scheduler.time()-lastTime;
        canvas.update(dt);
    }

    //wire input events
    public function onkeyup(k : Key, c : String) {
        canvas.keyup( kmAdapter.keyUp(k,c) );
    }

    public function onkeydown(k : Key, c : String) {
        if(k == Key.CHAR)
            canvas.textinput(kmAdapter.textEvent(k,c));
        canvas.keydown( kmAdapter.keyDown(k,c) );
    }

    public function onmousemove(x : Int, y : Int, a : Int, b : Int){
        canvas.mousemove( kmAdapter.mouseMoveEvent(x,y) );
    }

    public function onmousedown(button : Int, x : Int, y : Int){
        canvas.mousedown( kmAdapter.mouseDownEvent(button, x, y) );
    }

    public function onmouseup(button : Int, x : Int, y : Int){
        canvas.mouseup( kmAdapter.mouseUpEvent(button, x, y) );
    }

    public function onmousewheel(w : Int){
        canvas.mousewheel( kmAdapter.mouseWheelEvent(w) );
    }
}

```
