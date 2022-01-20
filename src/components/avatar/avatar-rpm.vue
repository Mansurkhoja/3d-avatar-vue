<template>
  <div
    style="width: 144px; height: 224px"
    id="avatar-rpm"
    class="avatar-rpm"
    ref="avatarContainer"
  ></div>
</template>

<script>
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { lerp, mapRange } from "./utils.js";
import { toRaw } from "vue";
export default {
  name: "AvatarRpm",
  props: {
    url: {
      type: String,
      default: "./avatar.glb",
    },
  },
  data() {
    return {
      camera: null,
      scene: null,
      renderer: null,
      clock: null,
      rightArm: null,
      leftArm: null,
      neck: null,
      canvaContainer: null,
      currentPos: null,
      targetPos: null,
    };
  },
  methods: {
    init() {
      this.currentPos = new THREE.Vector2(0, 0);
      this.targetPos = new THREE.Vector2(0, 0);
      this.canvaContainer = document.getElementById("avatar-rpm");
      this.camera = new THREE.PerspectiveCamera(
        45,
        this.canvaContainer.offsetWidth / this.canvaContainer.offsetHeight,
        0.01,
        10
      );
      this.camera.position.set(-0.33, 1.5, 2.9);
      this.clock = new THREE.Clock();
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0x049EF4);
      const light = new THREE.HemisphereLight(0xbbbbff, 0x444422);
      light.position.set(0, 1, 0);
      this.scene.add(light);

      // model
      const loader = new GLTFLoader();
      const me = this;
      loader.load(
        this.url,
        function (gltf) {
          const model = gltf.scene;
          model.scale.set(3, 3, 3);
          model.position.y = -3.5;
          me.rightArm = model.getObjectByName("RightArm");
          me.leftArm = model.getObjectByName("LeftArm");
          me.neck = model.getObjectByName("Neck");

          me.scene.add(model);
        },
        function (xhr) {
          console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
        },
        function () {
          console.log("An error happened");
        }
      );

      this.renderer = new THREE.WebGLRenderer({ antialias: true });
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.setSize(
        this.canvaContainer.offsetWidth,
        this.canvaContainer.offsetHeight
      );
      this.renderer.outputEncoding = THREE.sRGBEncoding;
      this.$refs.avatarContainer.appendChild(this.renderer.domElement);
      //window.addEventListener( 'resize', this.onWindowResize(), false );

      const controls = new OrbitControls(this.camera, this.renderer.domElement);
      controls.target.set(0, 1, 0);
      controls.update();
      this.canvaContainer.addEventListener("mousemove", this.rotateAvatar);
    },
    // onWindowResize() {
    //   this.camera.aspect = this.canvaContainer.offsetWidth / this.canvaContainer.offsetHeight;
    //   this.camera.updateProjectionMatrix();
    //   this.renderer.setSize( this.canvaContainer.offsetWidth, this.canvaContainer.offsetHeight );
    // },
    animate() {
      requestAnimationFrame(this.animate);
      const t = this.clock.getElapsedTime();
      if (this.rightArm) {
        this.rightArm.rotation.z += Math.sin(t) * 0.005;
        this.leftArm.rotation.z += Math.sin(t + 0.05) * 0.005;
        //this.neck.rotation.y += Math.sin( t ) * 0.004;
      }
      this.renderer.render(toRaw(this.scene), this.camera);
    },
    rotateAvatar(e) {
      const cameraRotation = Math.abs(this.camera.rotation.z);
      const rad = Math.PI / 180;
      let rect = e.target.getBoundingClientRect();
      let x = e.clientX - rect.left;
      let y = e.clientY - rect.top;
      if (cameraRotation < 0.2) {
        this.targetPos.x = mapRange(y, -1, 1, 5 * rad, -5 * rad);
        this.targetPos.y = mapRange(x, -1, 1, -10 * rad, 10 * rad);
      } else {
        this.targetPos.set(0, 0);
      }
      this.currentPos.x = lerp(this.currentPos.x, this.targetPos.x);
      this.currentPos.y = lerp(this.currentPos.y, this.targetPos.y);
      this.neck.rotation.x = this.currentPos.x + 0.1;
      this.neck.rotation.y = this.currentPos.y;
    },
  },
  mounted() {
    this.init();
    this.animate();
  },
};
</script>

<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
