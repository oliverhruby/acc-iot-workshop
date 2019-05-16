import { Component, OnInit } from '@angular/core';
import { IMqttMessage, MqttService } from 'ngx-mqtt';
import { SoundService } from '../../services/sound.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-widget-notification',
  templateUrl: './widget-notification.component.html',
  styleUrls: ['./widget-notification.component.css']
})
export class WidgetNotificationComponent implements OnInit {

  messages = [];
  subscriptionNotify: Subscription;

  constructor(
    private mqttService: MqttService,
    private soundService: SoundService
  ) { }

  ngOnInit() {
    this.subscriptionNotify = this.mqttService.observe("acc-iot-workshop/notify").subscribe((message: IMqttMessage) => {
      const msg = message.payload.toString();
      this.messages.push({ date: new Date().toLocaleTimeString(), message: msg });

      this.speak(msg);
    });
  }

  ngOnDestroy() {
    this.subscriptionNotify.unsubscribe();
  }

  clear() {
    this.messages = [];
  }

  speak(message) {
    const msg = new SpeechSynthesisUtterance(message);
    (<any>window).speechSynthesis.speak(msg);
  }
}
