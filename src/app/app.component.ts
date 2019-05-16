import { Component, OnInit } from '@angular/core';
import { IOnConnectEvent, IOnMessageEvent, MqttService } from 'ngx-mqtt';
import { MQTT_SERVICE_OPTIONS, } from './app.module';
import { Subscription } from 'rxjs';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  connected: boolean = false;
  mqttOptions: any;
  subscriptionConnect: Subscription;
  subscriptionClose: Subscription;
  subscriptionMessage: Subscription;

  constructor(private mqttService: MqttService) { }

  ngOnInit() {
    this.mqttOptions = MQTT_SERVICE_OPTIONS;

    this.subscriptionConnect = this.mqttService.onConnect.subscribe(
      (x: IOnConnectEvent) => this.connected = true
    );

    this.subscriptionClose = this.mqttService.onClose.subscribe(
      (x: IOnConnectEvent) => this.connected = false
    );

    this.subscriptionMessage = this.mqttService.onMessage.subscribe(
      (x: IOnMessageEvent) => console.log("[MQTT] " + x.topic + " " + x.payload)
    );
  }

  ngOnDestroy() {
    this.subscriptionConnect.unsubscribe();
    this.subscriptionClose.unsubscribe();
    this.subscriptionMessage.unsubscribe();
  }

}
