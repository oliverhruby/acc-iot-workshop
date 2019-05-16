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
  subscriptionWatering: Subscription;

  constructor(private mqttService: MqttService) { }

  ngOnInit() {
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
    this.subscriptionWatering.unsubscribe();
  }
}
