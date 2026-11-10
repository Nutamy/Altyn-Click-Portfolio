import * as THREE from 'three';
import {RoomEnvironment} from 'three/examples/jsm/environments/RoomEnvironment.js';
export function createWorld(canvas,onFallback){
 const mobile=matchMedia('(max-width: 600px)').matches;
 const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:!mobile,powerPreference:'low-power'});
 renderer.setPixelRatio(Math.min(devicePixelRatio,mobile?1.15:1.5));renderer.setClearColor(0x171b16,0);renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.25;
 const scene=new THREE.Scene();scene.fog=new THREE.Fog(0x171b16,12,29);
 const camera=new THREE.PerspectiveCamera(mobile?52:43,innerWidth/innerHeight,.1,60);
 const pmrem=new THREE.PMREMGenerator(renderer),room=new RoomEnvironment(),env=pmrem.fromScene(room,.04);scene.environment=env.texture;room.dispose();pmrem.dispose();
 const metal=new THREE.MeshStandardMaterial({color:0xc7ae65,metalness:1,roughness:.23,side:THREE.DoubleSide});
 const silver=new THREE.MeshStandardMaterial({color:0xb7beaa,metalness:1,roughness:.2});
 const geometry=new THREE.TorusKnotGeometry(1.45,.23,mobile?100:180,mobile?8:14,2,3);
 const ringGeometry=new THREE.TorusGeometry(2.5,.12,mobile?8:16,mobile?80:140);
 const stations=[[2.7,.25,0],[-1.6,.4,-9],[2.3,.3,-20],[-2.4,.4,-33],[2.1,.2,-43]];
 const objects=[];const screens=[];const loader=new THREE.TextureLoader();
 // Resolve source assets from the current page, so bundled chunks work on every language route.
 const root=new URL(document.querySelector('#leadForm').dataset.lang==='ru'?'./':'../',location.href);
 ['savepoint','elara','tropinka'].forEach((id,i)=>{
   const screen=new THREE.Group();screen.position.set(i%2?-2.3:2.3,.1,-11-i*11);screen.rotation.y=i%2?.12:-.12;
   const frame=new THREE.Mesh(new THREE.BoxGeometry(4.4,2.55,.12),metal);screen.add(frame);
   loader.load(new URL('screenshots/'+id+'/01.webp',root).href,texture=>{if(disposed){texture.dispose();return}texture.colorSpace=THREE.SRGBColorSpace;const material=new THREE.MeshBasicMaterial({map:texture});const panel=new THREE.Mesh(new THREE.PlaneGeometry(4.2,2.28),material);panel.position.z=.07;screen.add(panel);screens.push(panel);request()});scene.add(screen);
 });stations.forEach(([x,y,z],i)=>{const group=new THREE.Group();group.position.set(x,y,z);const knot=new THREE.Mesh(geometry,i%2===0?metal:silver);knot.rotation.set(.35,-.3,i*.3);knot.scale.set(1.05,1.35,1.05);group.add(knot);const ring=new THREE.Mesh(ringGeometry,metal);ring.rotation.set(.15,.32,-.45);ring.scale.set(1,1.28,1);group.add(ring);scene.add(group);objects.push(group)});
 // The same architectural material continues between the gallery stations.
 const railMaterial=new THREE.MeshStandardMaterial({color:0x555e42,metalness:.7,roughness:.35});
 const rails=new THREE.Group();for(let i=0;i<2;i++){const mesh=new THREE.Mesh(new THREE.BoxGeometry(.025,.025,55),railMaterial);mesh.position.set(i?4.8:-4.8,-2.3,-20);rails.add(mesh)}scene.add(rails);
 scene.add(new THREE.HemisphereLight(0xf6edd4,0x2c3e29,2));const key=new THREE.DirectionalLight(0xffedbb,4);key.position.set(-3,6,5);scene.add(key);const fill=new THREE.DirectionalLight(0xe5f4ea,2);fill.position.set(5,1,2);scene.add(fill);
 let anchors=[],disposed=false,queued=false,poorFrames=0,draws=0;
 const points=[new THREE.Vector3(0,0,8),new THREE.Vector3(mobile?0:-.25,0,1),new THREE.Vector3(0,0,-8),new THREE.Vector3(mobile?0:.25,.1,-24),new THREE.Vector3(0,0,-35)];
 function measure(){renderer.setSize(innerWidth,innerHeight,false);camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();anchors=[...document.querySelectorAll('[data-station]')].map(el=>el.getBoundingClientRect().top+scrollY);draw()}
 function draw(){queued=false;if(disposed||document.hidden)return;const started=performance.now();const y=scrollY;let i=0;while(i<anchors.length-2&&y>=anchors[i+1])i++;let f=THREE.MathUtils.clamp((y-anchors[i])/Math.max(1,anchors[i+1]-anchors[i]),0,1);
 // The gallery and approach retain a steady camera for most of their reading length.
 if(i>=2)f=THREE.MathUtils.smoothstep(f,.7,1);else f=f*f*(3-2*f);
 camera.position.lerpVectors(points[i],points[i+1],f);camera.lookAt(camera.position.x,camera.position.y,camera.position.z-10);key.position.z=camera.position.z+2;fill.position.z=camera.position.z-2;
 renderer.render(scene,camera);draws++;if(performance.now()-started>55)poorFrames++;if(draws>=16&&poorFrames>10){onFallback();dispose()}}
 function request(){if(!queued&&!disposed){queued=true;requestAnimationFrame(draw)}}
 function lost(e){e.preventDefault();onFallback();dispose()}
 function dispose(){if(disposed)return;disposed=true;removeEventListener('scroll',request);removeEventListener('resize',measure);removeEventListener('visibilitychange',request);canvas.removeEventListener('webglcontextlost',lost);geometry.dispose();ringGeometry.dispose();metal.dispose();silver.dispose();railMaterial.dispose();rails.children.forEach(m=>m.geometry.dispose());screens.forEach(m=>{m.geometry.dispose();m.material.map.dispose();m.material.dispose()});env.dispose();renderer.dispose()}
 addEventListener('scroll',request,{passive:true});addEventListener('resize',measure);addEventListener('visibilitychange',request);canvas.addEventListener('webglcontextlost',lost);document.fonts.ready.then(()=>{if(!disposed)measure()});measure();return {dispose,refresh:measure};
}
