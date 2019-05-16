import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { WebcamImage } from 'ngx-webcam';
import { IMqttMessage, MqttService } from 'ngx-mqtt';

@Component({
  selector: 'app-widget-camera',
  templateUrl: './widget-camera.component.html',
  styleUrls: ['./widget-camera.component.css']
})
export class WidgetCameraComponent implements OnInit {

  // latest snapshot
  webcamImage: WebcamImage = null;
  showWebcam: boolean = true;
  topic = "";

  constructor(private mqttService: MqttService) { }

  ngOnInit() {
  }

  private trigger: Subject<void> = new Subject<void>();

  action(topic: string) {
    this.topic = topic;
    this.trigger.next();
  }

  toggle() {
    this.showWebcam = !this.showWebcam;
  }

  handleImage(webcamImage: WebcamImage): void {
    this.webcamImage = webcamImage;
    this.mqttService.unsafePublish(
      "acc-iot-workshop/image/" + this.topic,
      this.webcamImage.imageAsDataUrl,
      { qos: 0, retain: false }
    );
  }

  get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }
}