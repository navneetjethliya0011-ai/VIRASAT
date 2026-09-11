// RajasthanScene - procedural golden desert world: fort, bazaar, stepwell, seal, Meera.
import * as THREE from 'three';
import { REGIONS, QUESTS, ARTIFACTS, getArtifactById, getDialogueById } from '../data/content.js';
import { gameState } from '../state/GameState.js';
import { makeSandstoneTexture, makeBannerTexture, makeWaterTexture } from '../utils/textures.js';
import { PlayerController } from '../engine/PlayerController.js';
import { CONFIG } from '../config.js';

const SCALE = 1;

export class RajasthanScene {
  constructor(renderer, ui, callbacks) {
    this.renderer = renderer;
    this.ui = ui;
    this.callbacks = callbacks || {};
    this.clock = new THREE.Clock();
    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();
    this.interactables = [];
    this.quest = QUESTS.find(q => q.id === 'heart_of_the_desert');
    this.stage =  0;
    this.sealFound = false;
    this.sealReturned = false;
    this._buildWorld();
    this._spawnPlayer();
    this._buildInteractables();
    this.ui.initHUD();
    this.ui.toast(this.quest.stages[0].label, 4000);
    setInterval(() => this.ui.updateQuest(this.quest.stages, this.stage +  1, 300), 3000);
    this.ui.updateJournalHints();
  }

  _buildWorld() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x2b6cb0);
    const groundGeo = new THREE.PlaneGeometry(360, 360);
    const groundMat = new THREE.MeshStandardMaterial({ map: makeSandstoneTexture(16,  16), color:  0xd9a15a });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI /  2;
    this.scene.add(ground);
    const hemi = new THREE.HemisphereLight(0xfff3d0,  0x7a4a2a,  1.0);
    this.scene.add(hemi);
    const sun = new THREE.DirectionalLight(0xffe2b3,  1.4);
    sun.position.set(60,  80,  30);
    this.scene.add(sun);
    const fortGroup = new THREE.Group();
    const stone = new THREE.MeshStandardMaterial({ map: makeSandstoneTexture(8,  8), color:  0xc9a35b });
    const fortPositions = [[-16, 0, -70],[-6,  0, -78],[6,  0, -74],[20,  0, -64],[14,  0, -80]];
    for (const [fx, fy, fz] of fortPositions) {
      const w =  10 + Math.random() * 8;
      const h =  18 + Math.random() * 12;
      const tower = new THREE.Mesh(new THREE.BoxGeometry(w, h, w), stone);
      tower.position.set(fx, h / 2, fz);
      fortGroup.add(tower);
      const spire = new THREE.Mesh(new THREE.ConeGeometry(2.2, w * 0.8, 4), stone);
      spire.position.set(fx, h + 1.2, fz);
      fortGroup.add(spire);
    }
    for (let i = -12; i <=  12; i +=  2) {
      const emb = new THREE.Mesh(new THREE.BoxGeometry(1.2,  0.9,  1.6), stone);
      emb.position.set(i,  20.6, -70);
      fortGroup.add(emb);
    }
    fortGroup.position.set(40,  0.2, -20);
    this.scene.add(fortGroup);
    const stallMat = new THREE.MeshStandardMaterial({ map: makeBannerTexture(8,  8), color:  0x2b6cb0 });
    for (const [sx, sz] of [[2, 12],[8, 16],[14, 14],[20,  12],[-2, 16]]) {
      const stall = new THREE.Mesh(new THREE.BoxGeometry(2.2,  3.2,  2.8), stallMat);
      stall.position.set(sx,  1.6, sz);
      this.scene.add(stall);
      const awning = new THREE.Mesh(new THREE.BoxGeometry(3.4,  0.2,  3.6), stallMat);
      awning.position.set(sx,  3.3, sz);
      this.scene.add(awning);
    }
    const archMat = new THREE.MeshStandardMaterial({ map: makeSandstoneTexture(4,  4), color:  0xd9a15a });
    const arch = new THREE.Mesh(new THREE.BoxGeometry(0.8,  5.5,  0.8), archMat);
    arch.position.set(4,  2.75, 12);
    this.scene.add(arch);
    const archTop = new THREE.Mesh(new THREE.BoxGeometry(3.4,  1.1,  0.8), archMat);
    archTop.position.set(4,  5.8, 12);
    this.scene.add(archTop);
    const stepwell = new THREE.Group();
    const stepMat = new THREE.MeshStandardMaterial({ map: makeSandstoneTexture(4,  4), color:  0xb08d5a });
    for (let step =  1; step <=  6; step++) {
      const ledge = new THREE.Mesh(new THREE.BoxGeometry(26 - step *  3,  0.5, 6), stepMat);
      ledge.position.set(56, step *  0.45, -22);
      stepwell.add(ledge);
    }
    const water = new THREE.Mesh(new THREE.PlaneGeometry(8,  6), new THREE.MeshStandardMaterial({ map: makeWaterTexture(6,  6), color:  0x2a6a9a, transparent: true, opacity:  0.8 }));
    water.rotation.x = -Math.PI /  2;
    water.position.set(59,  0.12, -22);
    stepwell.add(water);
    this.scene.add(stepwell);
    this._scatterCactiAndRocks();
    this._scatterCrates();
    this.scene.add(this._makeCamel());
  }

  _scatterCactiAndRocks() {
    const mat = new THREE.MeshStandardMaterial({ color: 0x5a7a3a });
    const rockMat = new THREE.MeshStandardMaterial({ color: 0x8a7a6a });
    for (let i =  0; i < 60; i++) {
      const x = (Math.random() -  0.5) * 320;
      const z = (Math.random() -  0.5) * 320;
      if (Math.abs(x) < 10 && Math.abs(z) < 10) continue;
      if (Math.hypot(x, z) < 25) continue;
      if (Math.random() < 0.55) {
        const h =  1.8 + Math.random() * 2.4;
        const cactus = new THREE.Mesh(new THREE.CylinderGeometry(0.35,  0.5, h,  6), mat);
        cactus.position.set(x, h /  2, z);
        cactus.rotation.y = Math.random() * Math.PI * 2;
        this.scene.add(cactus);
      } else {
        const r =  0.8 + Math.random() * 1.4;
        const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(r,  0), rockMat);
        rock.position.set(x, r /  2, z);
        rock.rotation.set(Math.random(), Math.random(), Math.random());
        this.scene.add(rock);
      }
    }
  }

  _scatterCrates() {
    const mat = new THREE.MeshStandardMaterial({ color: 0x8a6a4a });
    for (let i =  0; i <  8; i++) {
      const x = -20 + Math.floor(Math.random() * 40);
      const z = -12 + Math.floor(Math.random() * 28);
      const crate = new THREE.Mesh(new THREE.BoxGeometry(1.2,  1.2,  1.2), mat);
      crate.position.set(x,  0.6, z);
      crate.rotation.y = Math.random();
      this.scene.add(crate);
    }
  }

  _makeCamel() {
    const camel = new THREE.Group();
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0xb58a5a });
    const body = new THREE.Mesh(new THREE.SphereGeometry(1.4,  12,  10), bodyMat);
    body.scale.set(1.6,  0.9,  1);
    body.position.y = 1.2;
    camel.add(body);
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.3,  0.4,  2.4), bodyMat);
    neck.position.set(1.2,  1.6,  0);
    neck.rotation.z = - 0.4;
    camel.add(neck);
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.45,  10,  8), bodyMat);
    head.position.set(1.9,  2.2,  0);
    camel.add(head);
    const legGeo = new THREE.CylinderGeometry(0.22,  0.22,  1.3);
    const legMat = bodyMat;
    for (let i =  0; i <  4; i++) {
      const leg = new THREE.Mesh(legGeo, legMat);
      leg.position.set(i % 2 === 0 ? -0.8 : 0.8,  0.65, i < 2 ? -0.7 : 0.7);
      camel.add(leg);
    }
    camel.position.set(-12,  0, 18);
    camel.rotation.y = Math.PI *  0.75;
    this.scene.add(camel);
    return camel;
  }

  _spawnPlayer() {
    const region = REGIONS.find(r => r.id === CONFIG.startRegion);
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(region.start.x, region.start.y, region.start.z);
    this.controller = new PlayerController(this.camera, this.renderer.domElement, this.ui.settings);
    this.playerGroup = new THREE.Group();
    this.scene.add(this.camera);
    this.controller.setEyeHeight(1.7);
    this.controller.setTerrainY(() => this._groundY());
    this.controller.onLockChange = (locked) => this.ui.setPaused(!locked);
  }

  _groundY() {
    return Math.max(0, 0.02 * Math.sin(this.camera.position.x *  0.05) * Math.cos(this.camera.position.z *  0.05));
  }

	  _buildInteractables() {
	    const meera = this._makeNpc('meera', { x:  4, y:  0, z:  12 }, 0xd95a3a);
	    this.meeraMesh = meera.mesh;
	    this.interactables.push({
	      id: 'meera',
	      label: 'Meera',
	      hint: 'Press E to talk',
	      distance: 5,
	      position: meera.mesh.position,
	      onInteract: () => this._talkMeera(),
            });
	    const seal = this._makeSeal();
	    this.interactables.push({
	      id: 'seal',
	      label: 'Royal Sandstone Seal',
	      hint: 'Press E to pick up',
	      distance:  3.2,
	      position: seal.position,
	      onInteract: () => this._pickupSeal(seal),
	    });
	    const guide = this._makeNpc('guide', { x: -10, y:  0, z:  6 }, 0x2a5a8a);
	    this.interactables.push({
	      id: 'guide',
	      label: 'Cultural Guide',
	      hint: 'Press E to ask questions',
	      distance: 5,
	      position: guide.mesh.position,
	      onInteract: () => this._askGuide(),
	    });
	  }

	  _makeNpc(id, pos, color) {
	    const group = new THREE.Group();
	    const mat = new THREE.MeshStandardMaterial({ color });
	    const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.35,  0.5,  1.1,  8), mat);
	    torso.position.y = 0.9;
	    group.add(torso);
	    const head = new THREE.Mesh(new THREE.SphereGeometry(0.28,  16,  12), mat);
	    head.position.y = 1.55;
	    group.add(head);
	    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.6,  0.7,  0.1,  8), mat);
	    base.position.y = 0.05;
	    group.add(base);
	    group.position.set(pos.x, pos.y, pos.z);
	    this.scene.add(group);
	    return { mesh: group, pos };
	  }

	  _makeSeal() {
	    const seal =  new THREE.Group();
	    const mat = new THREE.MeshStandardMaterial({ color: 0xc98a2a });
	    const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.22,  0.22,  0.1,  12), mat);
	    disc.rotation.x = Math.PI /  2;
	    seal.add(disc);
	    const knob = new THREE.Mesh(new THREE.CylinderGeometry(0.08,  0.08,  0.16,  6), mat);
	    knob.position.y = 0.12;
	    seal.add(knob);
	    seal.position.set(59,  0.9, -20);
	    seal.rotation.y = Math.random() * Math.PI * 2;
	    this.scene.add(seal);
	    return seal;
	  }

	  _talkMeera() {
	    if (this.sealReturned) {
	      this.ui.showDialogue(getDialogueById('meera_seal_returned'));
	      return;
	    }
	    if (this.sealFound) {
	      const q = this.quest;
	      q.stages[1].done = true;
	      q.stages[2].done = true;
	      this.stage =  3;
	      this._completeQuest();
	      return;
	    }
	    this.ui.showDialogue(getDialogueById('meera_intro'), () => {
	      this.quest.stages[0].done = true;
	      this.quest.stages[1].done = true;
	      this.stage =  2;
	      if (this.ui.questPanel) this.ui.updateQuest(this.quest.stages, this.stage +  1, 300);
	    });
	  }

	  _pickupSeal(seal) {
	    if (this.sealFound) return;
	    this.sealFound = true;
	    this.sealMesh = seal;
	    this.scene.remove(seal);
	    gameState.addInventory(getArtifactById('raj_royal_seal'));
	    this.ui.toast('Royal Sandstone Seal added to inventory!', 4000);
	    this.quest.stages[2].done = true;
	    this.ui.updateQuest(this.quest.stages, 3,  300);
	    this.ui.updateInventory();
	  }

	  _completeQuest() {
	    if (this.quest.completed) return;
	    this.sealReturned = true;
	    this.quest.completed = true;
	    const rewardArt = getArtifactById('raj_phad_scroll');
	    gameState.addInventory(rewardArt);
	    gameState.addJournal('raj_meera');
	    gameState.addJournal('raj_stepwell');
	    gameState.completeQuest(this.quest.id);
	    this.ui.toast('Quest complete! Pabuji Phad Scroll +  120 XP',  4000);
	    this.ui.updateInventory();
	    this.ui.updateJournalHints();
	  }

	  _askGuide() {
	    this.ui.openGuide();
	  }

	  update() {
	    const dt = Math.min(this.clock.getDelta(),  0.05);
	    this.controller.update(dt);
	    this._updateInteractables();
	  }

	  _updateInteractables() {
	    this.raycaster.setFromCamera(this.pointer, this.camera);
	    const candidates = this.interactables.filter(i => i.distance);
	    for (const it of candidates) {
	      const dist = it.position.distanceTo(this.camera.position);
	      it.near = dist < it.distance;
	    }
    const nearest = candidates.filter(i => i.near).sort((a, b) => a.position.distanceTo(this.camera.position) - b.position.distanceTo(this.camera.position))[0];
	    if (this.controller.consumeE() && nearest) nearest.onInteract();
	    this.ui.setInteractHint(nearest ? nearest.label + ' - ' + nearest.hint : null);
	  }

	  dispose() {
	    this.controller.dispose();
	  }
	}