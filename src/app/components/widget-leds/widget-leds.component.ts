import { Component, OnInit } from '@angular/core';
import { IMqttMessage, MqttService } from 'ngx-mqtt';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-widget-leds',
  templateUrl: './widget-leds.component.html',
  styleUrls: ['./widget-leds.component.css']
})
export class WidgetLedsComponent implements OnInit {

  leds = [
    { r: 0, g: 0, b: 0 },
    { r: 0, g: 0, b: 0 },
    { r: 0, g: 0, b: 0 },
    { r: 0, g: 0, b: 0 },
    { r: 0, g: 0, b: 0 },
    { r: 0, g: 0, b: 0 },
    { r: 0, g: 0, b: 0 },
    { r: 0, g: 0, b: 0 }
  ];
  subscriptionLeds: Subscription;

  constructor(private mqttService: MqttService) { }

  ngOnInit() {
    this.subscriptionLeds = this.mqttService.observe("acc-iot-workshop/led/+").subscribe((message: IMqttMessage) => {
      var rgb = message.payload.toString().split(",");
      var index = parseInt(message.topic.split("/")[2]);
      this.leds[index] = {
        r: parseInt(rgb[0]) > 0 ? 255 : 0,
        g: parseInt(rgb[1]) > 0 ? 255 : 0,
        b: parseInt(rgb[2]) > 0 ? 255 : 0
      };
    });
  }

  onClick(i) {
    this.mqttService.unsafePublish("acc-iot-workshop/led/" + i,
      (this.leds[i].r == 0 && this.leds[i].g == 0 && this.leds[i].b == 0) ? "100,0,0" : "0,0,0",
      { qos: 2, retain: true }
    );
  }

  ngOnDestroy() {
    this.subscriptionLeds.unsubscribe();
  }

}