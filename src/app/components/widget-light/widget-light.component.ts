import { Component, OnInit } from '@angular/core';
import { IMqttMessage, MqttService } from 'ngx-mqtt';
import { SoundService } from '../../services/sound.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-widget-light',
  templateUrl: './widget-light.component.html',
  styleUrls: ['./widget-light.component.css']
})
export class WidgetLightComponent implements OnInit {

  light1 = 0;
  light2 = 0;
  light3 = 0;
  audio: HTMLAudioElement;
  subscriptionLight1: Subscription;
  subscriptionLight2: Subscription;
  subscriptionLight3: Subscription;

  constructor(
    private mqttService: MqttService,
    private soundService: SoundService
  ) { }

  ngOnInit() {
    this.subscriptionLight1 = this.mqttService.observe("acc-iot-workshop/light/1").subscribe((message: IMqttMessage) => {
      var val = parseInt(message.payload.toString());
      if (val != this.light1) {
        this.light1 = val;
        // this.soundService.play("click");
      }
    });

    this.subscriptionLight2 = this.mqttService.observe("acc-iot-workshop/light/2").subscribe((message: IMqttMessage) => {
      var val = parseInt(message.payload.toString());
      if (val != this.light2) {
        this.light2 = val;
        // this.soundService.play("click");
      }
    });

    this.subscriptionLight3 = this.mqttService.observe("acc-iot-workshop/light/3").subscribe((message: IMqttMessage) => {
      var val = parseInt(message.payload.toString());
      if (val != this.light3) {
        this.light3 = val;
        // this.soundService.play("click");
      }
    });
  }

  toggle(num) {
    this.mqttService.unsafePublish(
      "acc-iot-workshop/light/" + num.toString(),
      this["light" + num.toString()] == 1 ? "0" : "1"
    );
  }

  ngOnDestroy() {
    this.subscriptionLight1.unsubscribe();
    this.subscriptionLight2.unsubscribe();
    this.subscriptionLight3.unsubscribe();
  }

}