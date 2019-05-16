import { Component, OnInit, NgZone } from '@angular/core';

@Component({
  selector: 'app-widget-gyroscope',
  templateUrl: './widget-gyroscope.component.html',
  styleUrls: ['./widget-gyroscope.component.css']
})
export class WidgetGyroscopeComponent implements OnInit {

  orientation: DeviceOrientationEvent;
  acceleration: DeviceAcceleration;

  constructor(private zone: NgZone) { }

  ngOnInit() {
    let me = this;
    window.ondeviceorientation = function (data) {
      me.zone.run(() => me.orientation = data);
    };
    window.ondevicemotion = function (data) {
      me.zone.run(() => me.acceleration = data.acceleration);
    };
  }

}
