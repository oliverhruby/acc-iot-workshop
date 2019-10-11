import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { MqttModule, MqttService } from 'ngx-mqtt';
import { ChartsModule } from 'ng2-charts';
import { WebcamModule } from 'ngx-webcam';
import { Ng5SliderModule } from 'ng5-slider';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { WidgetPollComponent } from './components/widget-poll/widget-poll.component';
import { WidgetAudioComponent } from './components/widget-audio/widget-audio.component';
import { WidgetChartComponent } from './components/widget-chart/widget-chart.component';
import { WidgetCommandComponent } from './components/widget-command/widget-command.component';
import { WidgetCameraComponent } from './components/widget-camera/widget-camera.component';
import { WidgetFloorComponent } from './components/widget-floor/widget-floor.component';
import { WidgetFloor3dComponent } from './components/widget-floor3d/widget-floor3d.component';
import { WidgetGamepadComponent } from './components/widget-gamepad/widget-gamepad.component';
import { WidgetGyroscopeComponent } from './components/widget-gyroscope/widget-gyroscope.component';
import { WidgetLedsComponent } from './components/widget-leds/widget-leds.component';
import { WidgetLightComponent } from './components/widget-light/widget-light.component';
//import { WidgetMidiComponent } from './components/widget-midi/widget-midi.component';
import { WidgetNotificationComponent } from './components/widget-notification/widget-notification.component';
import { WidgetServoComponent } from './components/widget-servo/widget-servo.component';
import { WidgetTemperatureComponent } from './components/widget-temperature/widget-temperature.component';
import { WidgetWateringComponent } from './components/widget-watering/widget-watering.component';
import { WidgetWeatherComponent } from './components/widget-weather/widget-weather.component';

import { SpeechRecognitionService } from './services/speech-recognition.service';
import { SoundService } from './services/sound.service';


export const MQTT_SERVICE_OPTIONS = {
  hostname: '10.3.141.1',
  port: 9001,
  path: '/mqtt',
  protocol: <any>'ws'
  // hostname: 'broker.hivemq.com',
  // port: 8000,
  // path: '/mqtt',
  // protocol: <any>'ws'
  // hostname: 'oliverhruby.myds.me',
  // port: 9001,
  // path: '/mqtt',
  // protocol: <any>'wss'
  // hostname: 'test.mosquitto.org',
  // port: 8081,
  // path: '/mqtt',
  // protocol: <any>'wss'
  // hostname: 'iot.eclipse.org',
  // port: 443,
  // path: '/ws',
  // protocol: <any>'wss'
};

export function mqttServiceFactory() {
  return new MqttService(MQTT_SERVICE_OPTIONS);
}

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ChartsModule,
    HttpClientModule,
    MqttModule.forRoot({
      provide: MqttService,
      useFactory: mqttServiceFactory
    }),
    Ng5SliderModule,
    WebcamModule
  ],
  declarations: [
    AppComponent,
    WidgetPollComponent,
    WidgetAudioComponent,
    WidgetCameraComponent,
    WidgetChartComponent,
    WidgetCommandComponent,
    WidgetFloorComponent,
    WidgetFloor3dComponent,
    WidgetGamepadComponent,
    WidgetGyroscopeComponent,
    WidgetLedsComponent,
    WidgetLightComponent,
    //WidgetMidiComponent,
    WidgetNotificationComponent,
    WidgetServoComponent,
    WidgetTemperatureComponent,
    WidgetWateringComponent,
    WidgetWeatherComponent
  ],
  bootstrap: [AppComponent],
  providers: [
    SpeechRecognitionService,
    SoundService
  ]
})
export class AppModule { }
