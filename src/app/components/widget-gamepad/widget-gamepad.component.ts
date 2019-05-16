import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-widget-gamepad',
  templateUrl: './widget-gamepad.component.html',
  styleUrls: ['./widget-gamepad.component.css']
})
export class WidgetGamepadComponent implements OnInit {

  buttons: any;
  axes: any;
  name: string;

  constructor() { }

  ngOnInit() {
    this.animationFrame();
  }

  animationFrame() {
    var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);
    if (gamepads && gamepads[0] && gamepads[0].buttons) {
      this.name = gamepads[0].id;
      this.buttons = gamepads[0].buttons;
      this.axes = gamepads[0].axes;
    }
    requestAnimationFrame(() => this.animationFrame());
  }
}
