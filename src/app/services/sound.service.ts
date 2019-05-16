import { Injectable } from '@angular/core';

@Injectable()
export class SoundService {

  click: HTMLAudioElement;
  notification: HTMLAudioElement;
  sample1: HTMLAudioElement;
  sample2: HTMLAudioElement;

  constructor() {
    this.click = new Audio("https://soundbible.com/mp3/Click2-Sebastian-759472264.mp3");
    this.click.load();
    this.notification = new Audio("https://notificationsounds.com/soundfiles/a86c450b76fb8c371afead6410d55534/file-sounds-1108-slow-spring-board.mp3");
    this.notification.load();
    this.sample1 = new Audio("https://notificationsounds.com/soundfiles/a86c450b76fb8c371afead6410d55534/file-sounds-1108-slow-spring-board.mp3");
    this.sample1.load();
    this.sample2 = new Audio("https://notificationsounds.com/soundfiles/a86c450b76fb8c371afead6410d55534/file-sounds-1108-slow-spring-board.mp3");
    this.sample2.load();
  }

  public play(sample: string) {
    switch (sample) {
      case "click": this.click.play(); break;
      case "notification": this.notification.play(); break;
      case "sample1": this.sample1.play(); break;
      case "sample2": this.sample2.play(); break;
      default:
    }
  }

}