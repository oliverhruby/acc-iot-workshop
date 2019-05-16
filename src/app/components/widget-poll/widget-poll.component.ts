import { Component, OnInit } from '@angular/core';
import * as BABYLON from '@babylonjs/core';
import { IMqttMessage, MqttService } from 'ngx-mqtt';
import { Subscription } from 'rxjs';

/**
 * Example widget showing a 3D scene where objects are dynamically
 * updated based on values comming from MQTT topics
 */
@Component({
  selector: 'app-widget-poll',
  templateUrl: './widget-poll.component.html',
  styleUrls: ['./widget-poll.component.css']
})
export class WidgetPollComponent implements OnInit {

  canvas: HTMLCanvasElement;
  engine: BABYLON.Engine;
  scene: BABYLON.Scene;
  scale: number = 1.6;
  series: Array<any>;
  subscriptionStatus: Subscription;
  subscriptionLight1: Subscription;
  subscriptionLight2: Subscription;
  subscriptionLight3: Subscription;

  constructor(private mqttService: MqttService) { }

  ngOnInit() {
    this.series = [
      { label: "Beer", value: 0 },
      { label: "Coffee", value: 0 },
      { label: "Tea", value: 0 },
      { label: "Rum", value: 0 },
      { label: "Vodka", value: 0 },
      { label: "Water", value: 0 },
      { label: "Wine", value: 0 }
    ];

    this.render(this.series);

    // subscribe to light topic to simulate a real lamp in the scene
    this.subscriptionLight1 = this.mqttService.observe("acc-iot-workshop/light/1").subscribe((message: IMqttMessage) => {
      this.scene.getLightByID("Light").intensity = (message.payload.toString() == "1" ? 1 : 0.5);
    });
    this.subscriptionLight2 = this.mqttService.observe("acc-iot-workshop/light/2").subscribe((message: IMqttMessage) => {
      this.scene.getLightByID("SpotLight1").intensity = (message.payload.toString() == "1" ? 0.5 : 0);
    });
    this.subscriptionLight3 = this.mqttService.observe("acc-iot-workshop/light/3").subscribe((message: IMqttMessage) => {
      this.scene.getLightByID("SpotLight2").intensity = (message.payload.toString() == "1" ? 0.5 : 0);
    });

    // subscribe to poll updates and adjust the scene
    this.subscriptionStatus = this.mqttService.observe("acc-iot-workshop/poll/status").subscribe((message: IMqttMessage) => {
      this.series = JSON.parse(message.payload.toString());
      for (var i = 0; i < this.series.length; i++) {
        this.setValue(this.series[i].label, this.series[i].value);
      }
    });
  }

  ngOnDestroy() {
    this.subscriptionLight1.unsubscribe();
    this.subscriptionLight2.unsubscribe();
    this.subscriptionLight3.unsubscribe();
    this.subscriptionStatus.unsubscribe();
  }

  /**
   * Set the value of the bar and animate the transition from the existing height
   * of the box to the new to make it look more natural
   */
  setValue(label, data) {
    var bar = this.scene.getMeshByID(label);

    var animation = new BABYLON.Animation("anim", "scaling.y", 30,
      BABYLON.Animation.ANIMATIONTYPE_FLOAT);
    animation.setKeys([
      { frame: 0, value: bar.scaling.y },
      { frame: 100, value: data * this.scale + 0.01 }]);
    bar.animations.push(animation);

    animation = new BABYLON.Animation("anim2", "position.y", 30,
      BABYLON.Animation.ANIMATIONTYPE_FLOAT);
    animation.setKeys([
      { frame: 0, value: bar.position.y },
      { frame: 100, value: (data * this.scale) / 2 }]);
    bar.animations.push(animation);

    this.scene.beginAnimation(bar, 0, 100, false, 2.0);
  }

  /**
   * Reset all votes to zero
   */
  reset() {
    this.mqttService.unsafePublish("acc-iot-workshop/poll/reset", ".");
  }

  /**
   * Generate random state for poll votes
   */
  random() {
    this.mqttService.unsafePublish("acc-iot-workshop/poll/random", ".");
  }

  /**
   * The whole scene with objects, lights, etc. is defined here.
   * Here we code the creation of the scene, lights, meshes, etc.
   * but it's also possible to load the objects of the whole scene
   * from various formats.
   */
  render(series) {
    this.canvas = <HTMLCanvasElement>document.getElementById("renderCanvas");
    this.engine = new BABYLON.Engine(this.canvas, true, { preserveDrawingBuffer: true, stencil: true });

    var me = this;
    var createScene = function (engine) {

      var scene = new BABYLON.Scene(engine);
      scene.clearColor = new BABYLON.Color4(0, 0, 0, 1);

      var light = new BABYLON.DirectionalLight("Light", new BABYLON.Vector3(0, -0.5, 1.0), scene);
      light.position = new BABYLON.Vector3(0, 25, -50);
      light.intensity = 1;

      var spotLight1 = new BABYLON.SpotLight("SpotLight1", new BABYLON.Vector3(-20, 50, -10), new BABYLON.Vector3(0, -1, 0), Math.PI / 3, 2, scene);
      spotLight1.intensity = 0;

      var spotLight2 = new BABYLON.SpotLight("SpotLight2", new BABYLON.Vector3(20, 50, -10), new BABYLON.Vector3(0, -1, 0), Math.PI / 3, 2, scene);
      spotLight1.intensity = 0;

      var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 10, BABYLON.Vector3.Zero(), scene);
      camera.setPosition(new BABYLON.Vector3(0, 70, -100));
      // camera.useAutoRotationBehavior = true;
      camera.attachControl(this.canvas, true);

      var playgroundSize = 80;

      // Background
      var background = BABYLON.Mesh.CreatePlane("background", playgroundSize, scene, false);
      background.scaling.y = 0.5;
      background.position.z = playgroundSize / 2 - 0.5;
      background.position.y = playgroundSize / 4;
      background.receiveShadows = true;

      var backgroundTexture = new BABYLON.DynamicTexture("dynamic texture", 512, scene, true);
      backgroundTexture.drawText("Vote for your drink!", null, 250, "35px Arial", "white", "#224422");

      const backMaterial = new BABYLON.StandardMaterial("background", scene);
      backMaterial.diffuseTexture = backgroundTexture;
      backMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
      backMaterial.backFaceCulling = false;
      background.material = backMaterial;

      // Ground    
      var ground = BABYLON.Mesh.CreateGround("ground", playgroundSize, playgroundSize, 1, scene, false);
      var groundMaterial = new BABYLON.StandardMaterial("ground", scene);
      groundMaterial.diffuseColor = new BABYLON.Color3(0.2, 0.3, 0.2);
      groundMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
      ground.material = groundMaterial;
      ground.receiveShadows = true;
      ground.position.y = -0.1;

      var shadowGenerator = new BABYLON.ShadowGenerator(1024, light);
      shadowGenerator.usePoissonSampling = true;

      var createSeries = function (series) {
        var margin = 2;
        var offset = playgroundSize / (series.length) - margin;
        var x = -playgroundSize / 2 + offset / 2;

        for (var index = 0; index < series.length; index++) {
          var data = series[index];

          var bar = BABYLON.Mesh.CreateBox(data.label, 1.0, scene, false);
          bar.scaling = new BABYLON.Vector3(offset / 2.0, 0, offset / 2.0);
          bar.position.x = x;
          bar.position.y = 0;

          // Handle interaction with the scene    
          let actionManager = new BABYLON.ActionManager(scene);
          actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(
              {
                trigger: BABYLON.ActionManager.OnPickTrigger
              },
              function (evt: BABYLON.ActionEvent) {
                me.mqttService.unsafePublish("acc-iot-workshop/poll/vote", evt.source.id);
              }
            )
          );
          bar.actionManager = actionManager;

          // Material
          const barMaterial = new BABYLON.StandardMaterial(data.label + "mat", scene);
          barMaterial.diffuseColor = new BABYLON.Color3(1, 1, 0);
          barMaterial.emissiveColor = new BABYLON.Color3(0.5, 0.5, 0);
          barMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
          bar.material = barMaterial;

          // Shadows
          shadowGenerator.getShadowMap().renderList.push(bar);

          // Legend
          var barLegend = BABYLON.Mesh.CreateGround(data.label + "Legend", playgroundSize / 2, offset * 2, 1, scene, false);
          barLegend.position.x = x;
          barLegend.position.z = -playgroundSize / 4;
          barLegend.rotation.y = Math.PI / 2;

          var barLegendTexture = new BABYLON.DynamicTexture("dynamic texture", 512, scene, true);
          const legendMaterial = new BABYLON.StandardMaterial(data.label + "LegendMat", scene);
          legendMaterial.diffuseTexture = barLegendTexture;
          legendMaterial.emissiveColor = new BABYLON.Color3(0.4, 0.4, 0.4);
          barLegendTexture.hasAlpha = true;
          barLegend.material = legendMaterial;

          var size = barLegendTexture.getSize();
          barLegendTexture.drawText(data.label + " (" + data.value + ")", 80, size.height / 2 + 30, "50px Arial", "white", "transparent");

          // Going next
          x += offset + margin;
        }
      };

      createSeries(series);

      // Limit camera
      camera.lowerAlphaLimit = Math.PI;
      camera.upperAlphaLimit = 2 * Math.PI;
      camera.lowerBetaLimit = 0.1;
      camera.upperBetaLimit = (Math.PI / 2) * 0.99;
      camera.lowerRadiusLimit = 5;
      camera.upperRadiusLimit = 150;

      return scene;
    }.bind(this);

    var scene = createScene(this.engine);
    this.scene = scene;

    // var serializedScene = BABYLON.SceneSerializer.Serialize(scene);
    // var strScene = JSON.stringify(serializedScene);
    // console.log(strScene);

    // run the render loop
    this.engine.runRenderLoop(function () {
      scene.render();
    });

    // handle the screen resize events
    var me = this;
    window.addEventListener("resize", function () {
      me.engine.resize();
    });

  }

}
