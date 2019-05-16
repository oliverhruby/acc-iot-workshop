import { Component, OnInit, NgZone } from '@angular/core';
import { from } from "rxjs/internal/observable/from";
import { map, filter, flatMap } from "rxjs/operators";
import { Subject } from "rxjs/internal/Subject";
import { Subscription } from 'rxjs';
import { IMqttMessage, MqttService } from 'ngx-mqtt';

declare const navigator: any;

@Component({
  selector: 'app-widget-midi',
  templateUrl: './widget-midi.component.html',
  styleUrls: ['./widget-midi.component.css']
})
export class WidgetMidiComponent implements OnInit {

  access: WebMidi.MIDIAccess;
  message: any;
  subscriptionMidi: Subscription;

  constructor(private mqttService: MqttService, private zone: NgZone) { }

  ngOnInit() {
    var me = this;
    navigator.requestMIDIAccess()
      .then(function (access: WebMidi.MIDIAccess) {

        me.access = access;

        access.onstatechange = function (e: WebMidi.MIDIConnectionEvent) {
          console.log(e.port.name, e.port.manufacturer, e.port.state);
        };
      });

    this.connect("LoopBe Internal MIDI");
  }

  public connect(deviceName: string) {
    from(navigator.requestMIDIAccess())
      .pipe(
        // get the first input device
        map((midi: WebMidi.MIDIAccess) => {
          return Array.from(midi.inputs.values()).find(
            (a: any) => a.name === deviceName
          );
        }),
        filter(input => input !== undefined),
        // convert the onmidimessage event to observable
        flatMap(input => this.midiMessageAsObservable(input)),
        // transform the message to an object
        map((message: WebMidi.MIDIMessageEvent) => {
          /* tslint:disable */
          // status is the first byte.
          const status = message.data[0];
          // command is the four most significant bits of the status byte.
          const command = status >>> 4;
          // channel 0-15 is the lower four bits.
          const channel = (status & 0xf) + 1;
          const msg = {
            Date: new Date(),
            Channel: channel,
            Status: status,
            Data1: message.data[1],
            Data2: message.data[2]
          };
          return msg;
        }),
        // ignore messages with empty data (for example clock signals)
        filter((message) => message.Data1 != null)
      )
      .subscribe((message) => {
        this.zone.run(() => {
          this.message = message;
          this.mqttService.unsafePublish("acc-iot-workshop/midi",
            JSON.stringify(this.message), { qos: 0, retain: false }
          );
        });
      });

  }

  private midiMessageAsObservable(input) {
    const source = new Subject();
    input.onmidimessage = note => source.next(note);
    return source.asObservable();
  }

  ngOnDestroy() {
    this.subscriptionMidi.unsubscribe();
  }
}
