import { Component, OnInit } from '@angular/core';
import { IMqttMessage, MqttService } from 'ngx-mqtt';
import { SpeechRecognitionService } from '../../services/speech-recognition.service';

@Component({
  selector: 'app-widget-command',
  templateUrl: './widget-command.component.html',
  styleUrls: ['./widget-command.component.css']
})
export class WidgetCommandComponent implements OnInit {

  command: string = ""
  showSearchButton: boolean;

  constructor(
    private speechRecognitionService: SpeechRecognitionService,
    private mqttService: MqttService) { }

  ngOnInit() {

  }

  ngOnDestroy() {
    this.speechRecognitionService.DestroySpeechObject();
  }

  send() {
    this.mqttService.unsafePublish(
      "acc-iot-workshop/command",
      this.command,
      { qos: 0, retain: false }
    );
    this.command = "";
  }

  onKeydown(event) {
    if (event.key === "Enter") {
      this.send();
    }
  }

  listen() {
    this.showSearchButton = false;

    this.speechRecognitionService.record()
      .subscribe(
        //listener
        (value) => {
          this.command = value;
          this.send();
        },
        //errror
        (err) => {
          console.log(err);
          if (err.error == "no-speech") {
            console.log("--restatring service--");
            this.listen();
          }
        },
        //completion
        () => {
          this.showSearchButton = true;
          console.log("--complete--");
          this.listen();
        });
  }
}
