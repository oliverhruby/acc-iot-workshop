import { Component, OnInit } from '@angular/core';
import { IMqttMessage, MqttService } from 'ngx-mqtt';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-widget-temperature',
  templateUrl: './widget-temperature.component.html',
  styleUrls: ['./widget-temperature.component.css']
})
export class WidgetTemperatureComponent implements OnInit {

  temperature = "-";
  humidity = "-";
  subscriptionTemperature: Subscription;
  subscriptionHumidity: Subscription;

  constructor(private mqttService: MqttService) { }

  ngOnInit() {
    this.subscriptionTemperature = this.mqttService.observe("acc-iot-workshop/temperature").subscribe((message: IMqttMessage) => {
      this.temperature = parseFloat(message.payload.toString()).toFixed(1);
    });

    this.subscriptionHumidity = this.mqttService.observe("acc-iot-workshop/humidity").subscribe((message: IMqttMessage) => {
      this.humidity = parseFloat(message.payload.toString()).toFixed(1);
    });
  }

  ngOnDestroy() {
    this.subscriptionTemperature.unsubscribe();
    this.subscriptionHumidity.unsubscribe();
  }
}
