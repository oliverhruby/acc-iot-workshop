import { Component, OnInit } from '@angular/core';
import { Options } from 'ng5-slider';
import { SoundService } from '../../services/sound.service';

@Component({
  selector: 'app-widget-audio',
  templateUrl: './widget-audio.component.html',
  styleUrls: ['./widget-audio.component.css']
})
export class WidgetAudioComponent implements OnInit {

  public audioCtx: AudioContext;
  public oscillator: OscillatorNode;
  public frequency: number = 440;

  constructor(private soundService: SoundService) { }

  options: Options = {
    floor: 0,
    ceil: 4000
  };

  ngOnInit() {
    this.audioCtx = new (<any>window.AudioContext || window.webkitAudioContext);
  }

  start() {
    var oscillator = this.audioCtx.createOscillator();
    oscillator.type = "sine";
    // value in hertz
    oscillator.frequency.setValueAtTime(this.frequency, this.audioCtx.currentTime);
    oscillator.connect(this.audioCtx.destination);
    oscillator.start();
    this.oscillator = oscillator;
  }

  stop() {
    this.oscillator.stop();
  }

  setFrequency() {
    this.oscillator.frequency.setValueAtTime(this.frequency, this.audioCtx.currentTime);
  }

  playSample(sample: string) {
    this.soundService.play(sample);
  }

}