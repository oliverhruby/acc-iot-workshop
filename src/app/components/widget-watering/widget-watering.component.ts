import { Component, OnInit } from '@angular/core';
import { IMqttMessage, MqttService } from 'ngx-mqtt';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-widget-watering',
  templateUrl: './widget-watering.component.html',
  styleUrls: ['./widget-watering.component.css']
})
export class WidgetWateringComponent implements OnInit {

  status = 0;
  distance = 0;
  subscriptionDistance: Subscription;
  subscriptionWatering: Subscription;

  constructor(private mqttService: MqttService) { }

  ngOnInit() {
    this.subscriptionDistance = this.mqttService.observe("acc-iot-workshop/distance").subscribe((message: IMqttMessage) => {
      this.distance = parseInt(message.payload.toString());
    });
    this.subscriptionWatering = this.mqttService.observe("acc-iot-workshop/watering").subscribe((message: IMqttMessage) => {
      this.status = parseInt(message.payload.toString());
    });
  }

  toggle() {
    this.mqttService.unsafePublish("acc-iot-workshop/watering",
      this.status == 1 ? "0" : "1", { qos: 0, retain: true }
    );
  }

  ngOnDestroy() {
    this.subscriptionDistance.unsubscribe();
    this.subscriptionWatering.unsubscribe();
  }
}
