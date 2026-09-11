// First-person player controller: WASD/mouse look, sprint, E interact.

import * as THREE from 'three';
import { KEYS } from '../config.js';
import { clamp, damp } from '../utils/helpers.js';

export class PlayerController {
  constructor(camera, domElement, settings) {
    this.camera = camera;
    this.dom = domElement || document.body;
    this.settings = settings;
    this.keys = {};
    this.ePressed = false;
    this.eConsumed = false;
    this.velocity = new THREE.Vector3();
    this.yaw =  0;
    this.pitch = 0;
    this.onGround = true;
    this.sprinting = false;
    this.pointerLocked = false;
    this.enabled = true;
    this.terrainY = null;
    this.eyeHeight = 1.7;
    this.onLockChange = null;
    this._bind();
  }


  _bind() {
    this._onKeyDown = this._onKeyDown.bind(this);
    this._onKeyUp = this._onKeyUp.bind(this);
    this._onMouseMove = this._onMouseMove.bind(this);
    this._onPointerLockChange = this._onPointerLockChange.bind(this);
    this._onClick = this._onClick.bind(this);
    window.addEventListener('keydown', this._onKeyDown);
    window.addEventListener('keyup', this._onKeyUp);
    document.addEventListener('mousemove', this._onMouseMove);
    document.addEventListener('pointerlockchange', this._onPointerLockChange);
    this.dom.addEventListener('click', this._onClick);
  }

  dispose() {
    window.removeEventListener('keydown', this._onKeyDown);
    window.removeEventListener('keyup', this._onKeyUp);
    document.removeEventListener('mousemove', this._onMouseMove);
    document.removeEventListener('pointerlockchange', this._onPointerLockChange);
    this.dom.removeEventListener('click', this._onClick);
  }

  _isMoveKey(code) {
    return KEYS.forward.includes(code) || KEYS.back.includes(code) || KEYS.left.includes(code) || KEYS.right.includes(code);
  }

  _onKeyDown(e) {
    this.keys[e.code] = true;
    if(e.code == KEYS.interact) {
      this.ePressed = true;
      this.eConsumed = false;
    }
    if(this._isMoveKey(e.code)) e.preventDefault();
    if(e.code == KEYS.sprint) this.sprinting = true;
  }

  _onKeyUp(e) {
    this.keys[e.code] = false;
    if(e.code == KEYS.sprint) this.sprinting = false;
    if(e.code == KEYS.interact) this.ePressed = false;
  }

  _onMouseMove(e) {
    if(!this.pointerLocked || !this.enabled) return;
    const sens =(this.settings.get('sensitivity') || 1) * 0.0022;
    this.yaw -= e.movementX * sens;
    this.pitch -= e.movementY * sens * (this.settings.get('invertY') ? -1 :  1);
    this.pitch = clamp(this.pitch,-1.5,1.5);
  }

  _onClick() {
    if(!this.enabled) return;
    if(!this.pointerLocked) this.requestLock();
  }

  _onPointerLockChange() {
    this.pointerLocked = document.pointerLockElement === this.dom;
    if(this.onLockChange) this.onLockChange(this.pointerLocked);
  }

  requestLock() {
    try { this.dom.requestPointerLock(); } catch(err) {};
  }

  exitLock() {
    if(document.pointerLockElement) document.exitPointerLock();
  }

  consumeE() {
    const was = this.ePressed && !this.eConsumed;
    if(was) this.eConsumed = true;
    return was;
  }

  setTerrainY(fn) { this.terrainY = fn; }
  setEyeHeight(h) { this.eyeHeight = h; }


  update(dt) {
    if(!this.enabled) return;
    const moving = this.keys['KeyW'] || this.keys['KeyA'] || this.keys['KeyS'] || this.keys['KeyD'];
    const speed = this.sprinting ? 8.5 :  4.6;
    const fwd = ((this.keys['KeyW'] || this.keys['ArrowUp']) ? 1 :  0) - ((this.keys['KeyS'] || this.keys['ArrowDown']) ? 1 :  0);
    const strafe = ((this.keys['KeyD'] || this.keys['ArrowRight']) ? 1 :  0) - ((this.keys['KeyA'] || this.keys['ArrowLeft']) ? 1 :  0);
    const sin = Math.sin(this.yaw), cos = Math.cos(this.yaw);
    const dir = new THREE.Vector3(-sin * fwd + cos * strafe,  0, -cos * fwd - sin * strafe);
    if(dir.lengthSq()> 0) dir.normalize();
    this.velocity.x = damp(this.velocity.x, dir.x * speed, 36, dt);
    this.velocity.z = damp(this.velocity.z, dir.z * speed,  36, dt);
    this.camera.position.z += this.velocity.z * dt;
    this.camera.position.x += this.velocity.x * dt;
    if(this.terrainY) {
      const ground = this.terrainY(this.camera.position.x, this.camera.position.z);
      this.camera.position.y = damp(this.camera.position.y, ground + this.eyeHeight, 10, dt);
    }
    this.camera.rotation.order = 'YXZ';
    this.camera.rotation.y = this.yaw;
    this.camera.rotation.x = this.pitch;
  }
}


