/* 1. randomise hue 0-360 */
const hue = Math.random()*360;
document.documentElement.style.setProperty('--hue', hue);

/* 2. Three.js animated gradient mesh */
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, innerWidth/innerHeight, .1, 1000);
const renderer = new THREE.WebGLRenderer({canvas:document.getElementById('bgCanvas'), alpha:true});
renderer.setSize(innerWidth, innerHeight);
const geo = new THREE.PlaneGeometry(12,6,32,32);
const mat = new THREE.ShaderMaterial({
  uniforms:{time:{value:0}, colorA:{value:new THREE.Color(`hsl(${hue},40%,20%)`)}, colorB:{value:new THREE.Color(`hsl(${hue+40},40%,30%)`)} },
  vertexShader:`uniform float time; void main(){vec3 p=position; p.z+=sin(p.x*2.+time)*.2; gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);}`,
  fragmentShader:`uniform vec3 colorA, colorB; void main(){gl_FragColor=vec4(mix(colorA,colorB,gl_FragCoord.y/600.),.6);}`
});
const mesh = new THREE.Mesh(geo, mat);
scene.add(mesh);
camera.position.z = 5;
let time = 0;
requestAnimationFrame(function animate(t){
  time += .01;
  mat.uniforms.time.value = time;
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
});
addEventListener('resize', () => {
  renderer.setSize(innerWidth, innerHeight);
  camera.aspect = innerWidth/innerHeight;
  camera.updateProjectionMatrix();
});

/* 3. fetch & inject posts (random order) */
fetch('assets/data.json').then(r=>r.json()).then(list=>{
  list.sort(() => Math.random() - .5);
  const html = list.map(p => `
    <article class="card">
      <h2>${p.title}</h2>
      <p>${p.excerpt}</p>
      <button class="micron" data-micron="bounce">♥ Like</button>
    </article>`).join('');
  posts.innerHTML = html;
  Micron.init(); /* micron hover pop */
  /* 4. GSAP scroll reveal */
  gsap.registerPlugin(ScrollTrigger);
  gsap.from('.card', {
    y: 60, opacity: 0, duration: .8, stagger:.15,
    scrollTrigger: { trigger:'.grid', start:'top 80%', toggleActions:'play none none reverse' }
  });
});