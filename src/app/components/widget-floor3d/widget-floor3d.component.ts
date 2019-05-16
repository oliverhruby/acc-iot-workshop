import { Component, OnInit } from '@angular/core';
import { IMqttMessage, MqttService } from 'ngx-mqtt';
import { Subscription } from 'rxjs';
import * as BABYLON from '@babylonjs/core';
import '@babylonjs/loaders';

@Component({
  selector: 'app-widget-floor3d',
  templateUrl: './widget-floor3d.component.html',
  styleUrls: ['./widget-floor3d.component.css']
})
export class WidgetFloor3dComponent implements OnInit {


  canvas: HTMLCanvasElement;
  engine: BABYLON.Engine;
  scene: BABYLON.Scene;
  light = 0;
  subscriptionLight1: Subscription;

  constructor(private mqttService: MqttService) { }

  ngOnInit() {
    this.render();

    this.subscriptionLight1 = this.mqttService.observe("acc-iot-workshop/light/1").subscribe((message: IMqttMessage) => {
      this.light = parseInt(message.payload.toString());
      (this.scene.getMeshByID("Sphere").material as BABYLON.StandardMaterial).emissiveColor =
        this.light === 1 ? BABYLON.Color3.Yellow() : BABYLON.Color3.White();
    });
  }

  render() {
    this.canvas = <HTMLCanvasElement>document.getElementById("floor3dCanvas");
    this.engine = new BABYLON.Engine(this.canvas, true, { preserveDrawingBuffer: true, stencil: true });
    var me = this;
    var createScene = function (engine) {

      var scene = new BABYLON.Scene(engine);
      scene.clearColor = new BABYLON.Color4(0, 0, 0, 1);

      const light = new BABYLON.HemisphericLight(name, BABYLON.Vector3.Zero(), scene);
      light.intensity = 1;

      // Add a sphere to the scene which will represent a light
      const sphere = BABYLON.MeshBuilder.CreateSphere("Sphere", { diameter: 1000 }, scene);
      var sphereMaterial = new BABYLON.StandardMaterial("SphereMaterial", scene);
      sphereMaterial.diffuseColor = new BABYLON.Color3(1, 0, 1);
      sphereMaterial.specularColor = new BABYLON.Color3(0.5, 0.6, 0.87);
      sphereMaterial.emissiveColor = new BABYLON.Color3(1, 1, 1);
      sphereMaterial.ambientColor = new BABYLON.Color3(0.23, 0.98, 0.53);
      sphere.material = sphereMaterial;
      sphere.position = new BABYLON.Vector3(5750, 1250, 7450);

      // Handle interaction with the scene (toggle light)    
      let actionManager = new BABYLON.ActionManager(scene);
      actionManager.registerAction(
        new BABYLON.ExecuteCodeAction(
          {
            trigger: BABYLON.ActionManager.OnPickTrigger
          },
          function (evt: BABYLON.ActionEvent) {
            me.mqttService.unsafePublish("acc-iot-workshop/light/1", me.light === 1 ? "0" : "1");
          }
        )
      );
      sphere.actionManager = actionManager;

      // Add a camera
      const camera = new BABYLON.ArcRotateCamera("Camera", 0, 1, 20000, BABYLON.Vector3.Zero(), scene);
      camera.panningSensibility = 0.1;
      camera.maxZ = 100000;
      camera.attachControl(this.canvas, true);
      // const camera = new BABYLON.UniversalCamera("Camera", new BABYLON.Vector3(0, 1, 20000), scene);
      // camera.speed = 1000;
      // camera.maxZ = 30000;
      // camera.attachControl(this.canvas, true);
      // camera.setTarget(BABYLON.Vector3.Zero());

      BABYLON.SceneLoader.Append(
        "https://xeogl.org/examples/models/gltf/office/", "scene.gltf",
        this.scene,
        function (scene) {
        });

      return scene;
    }.bind(this);

    var scene = createScene(this.engine);
    this.scene = scene;

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
