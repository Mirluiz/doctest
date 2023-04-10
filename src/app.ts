import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { floor, spheres, walls } from "./components/objects";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

class App {
  objects: Array<THREE.Mesh> = [];
  camera: THREE.Camera;
  scene: THREE.Scene;
  renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer();
  axis: THREE.AxesHelper = new THREE.AxesHelper(500);
  controls: OrbitControls;
  panel: HTMLElement = document.querySelector("#root") as HTMLElement;
  constructor() {
    this.renderer.setClearColor(0xffffff);

    this.renderer.setSize(this.panel.clientWidth, this.panel.clientHeight);
    this.panel.appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(
      75,
      this.panel.clientWidth / this.panel.clientHeight,
      1,
      300
    );
    this.camera.up = new THREE.Vector3(0, 0, 1);
    this.camera.position.set(40, 40, 40);

    this.scene = new THREE.Scene();
    // this.scene.rotation.x = Math.PI;
    this.scene.background = new THREE.Color(0xf6eedc);
    this.scene.fog = new THREE.Fog(0xa0a0a0, 200, 1000);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.minDistance = 3;
    this.controls.maxDistance = 200;
    this.controls.update();

    const spotLight = new THREE.SpotLight(0xffffff, 2);
    spotLight.distance = 300;
    spotLight.angle = 3;
    spotLight.position.set(15, 40, 100);
    this.scene.add(spotLight);

    // const ambientLight = new THREE.AmbientLight(0x222222);
    // this.scene.add(ambientLight);

    this.scene.add(this.axis);

    this.initEvents();
    this.loadModels();
    this.loadObjects();
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));
    this.renderer.render(this.scene, this.camera);
  }

  loadObjects() {
    this.scene.add(/*...floor(), ...walls(),*/ ...spheres());
  }

  addObject(type: "box" | "sphere" | "cone", scale: number) {
    let geometry, material;

    switch (type) {
      case "box":
        geometry = new THREE.BoxGeometry(scale, scale, scale);
        material = new THREE.MeshPhongMaterial({
          color: 0xffffff,
        });

        break;
      case "sphere":
        geometry = new THREE.SphereGeometry(scale, 32, 32);
        material = new THREE.MeshPhongMaterial({
          color: 0xffffff,
        });
        break;
      case "cone":
        geometry = new THREE.ConeGeometry(scale, scale, scale * 1.5);
        material = new THREE.MeshPhongMaterial({
          color: 0xffffff,
        });
        break;
    }

    if (geometry && material) {
      let mesh = new THREE.Mesh(geometry, material);
      mesh.receiveShadow = true;
      mesh.castShadow = true;
      mesh.position.set(
        randomBetween(50, 0),
        randomBetween(50, 0),
        randomBetween(50, 0)
      );
      this.scene.add(mesh);
      this.list();
    }
  }

  deleteObject(id: string) {
    let element = this.scene?.getObjectByProperty("uuid", id);
    if (element) this.scene.remove(element);

    this.list();
  }

  initEvents() {
    let addbutton = document.querySelector("#addbutton");
    let scale: HTMLInputElement | null = document.querySelector("#scale");
    let selection: HTMLSelectElement | null =
      document.querySelector("#selection");

    addbutton?.addEventListener("click", () => {
      let val: "box" | "sphere" | "cone" = selection?.value as
        | "box"
        | "sphere"
        | "cone";
      let scaleValue = scale!.value;
      this.addObject(val, +scaleValue);
    });
  }

  loadModels() {
    const loader = new GLTFLoader();
    let { scene } = this;

    loader.load(
      // resource URL
      "scene.gltf",
      // called when the resource is loaded
      function (gltf) {
        let _i = 0;
        let _max = 100;
        let offset = 5;

        while (_i < _max) {
          let object = gltf.scene.clone();
          scene.add(object);
          object.rotation.x = Math.PI / 2;
          object.position.set(
            (_i * offset) % 50,
            Math.floor((_i * offset) / 50) * offset,
            1
          );
          _i++;
        }
      },
      // called while loading is progressing
      function (xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      // called when loading has errors
      function (error) {
        console.log("An error happened", error);
      }
    );
  }

  list() {
    let list = document.querySelector("#listcontainer");
    let content = "";

    this.scene.children.map((o) => {
      if (o instanceof THREE.Mesh) {
        content += `<div class="list-item">
                      <div>${o.uuid}</div>
                      <div class="list-item_delete" data-id="${o.uuid}">X</div>
                    </div>`;
      }
    });

    list!.innerHTML = content;

    let _this = this;
    list!.addEventListener("click", function (e: Event) {
      let id = (e.target as HTMLTextAreaElement).getAttribute("data-id");
      if (id) {
        _this.deleteObject(id);
      }
      e.stopPropagation();
    });
  }
}

const randomBetween = (max: number, min: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export default App;
