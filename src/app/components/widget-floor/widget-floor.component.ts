import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { IMqttMessage, MqttService } from 'ngx-mqtt';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-widget-floor',
  templateUrl: './widget-floor.component.html',
  styleUrls: ['./widget-floor.component.css']
})
export class WidgetFloorComponent implements OnInit {

  movement = 0;
  luminosity = 0;
  light1 = 0;
  light2 = 0;
  light3 = 0;
  subscriptionMovement: Subscription;
  subscriptionLuminosity: Subscription;
  subscriptionLight1: Subscription;
  subscriptionLight2: Subscription;
  subscriptionLight3: Subscription;

  constructor(private mqttService: MqttService) { }

  ngOnInit() {
    this.subscriptionMovement = this.mqttService.observe("acc-iot-workshop/movement").subscribe((message: IMqttMessage) => {
      this.movement = parseInt(message.payload.toString());
    });

    this.subscriptionLuminosity = this.mqttService.observe("acc-iot-workshop/luminosity").subscribe((message: IMqttMessage) => {
      this.luminosity = parseInt(message.payload.toString());
    });

    this.subscriptionLight1 = this.mqttService.observe("acc-iot-workshop/light/1").subscribe((message: IMqttMessage) => {
      this.light1 = parseInt(message.payload.toString());
    });

    this.subscriptionLight2 = this.mqttService.observe("acc-iot-workshop/light/2").subscribe((message: IMqttMessage) => {
      this.light2 = parseInt(message.payload.toString());
    });

    this.subscriptionLight3 = this.mqttService.observe("acc-iot-workshop/light/3").subscribe((message: IMqttMessage) => {
      this.light3 = parseInt(message.payload.toString());
    });
  }

  ngOnDestroy() {
    this.subscriptionMovement.unsubscribe();
    this.subscriptionLuminosity.unsubscribe();
    this.subscriptionLight1.unsubscribe();
    this.subscriptionLight2.unsubscribe();
    this.subscriptionLight3.unsubscribe();
  }

  light(num) {
    this.mqttService.unsafePublish("acc-iot-workshop/light/" + num.toString(),
      this["light" + num.toString()] == 1 ? "0" : "1",
      { qos: 2, retain: true }
    );
  }
}
