import { Component, OnInit } from '@angular/core';
import { IMqttMessage, MqttService } from 'ngx-mqtt';
import { Options } from 'ng5-slider';

@Component({
  selector: 'app-widget-servo',
  templateUrl: './widget-servo.component.html',
  styleUrls: ['./widget-servo.component.css']
})
export class WidgetServoComponent implements OnInit {

  pan: number = 0;
  tilt: number;

  options: Options = {
    floor: 0,
    ceil: 180,
    vertical: true
  };

  constructor(private mqttService: MqttService) { }

  ngOnInit() {

  }

  changePan() {
    this.mqttService.unsafePublish("acc-iot-workshop/servo",
      this.pan.toString(),
      { qos: 2, retain: false }
    );
  }

}