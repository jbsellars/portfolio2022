var init = function() {

    var width = 400,
        height = 400;

    //create scene w/ fog
    var scene = new THREE.Scene();
    scene.background = new THREE.Color( 0x3A3532 );
	scene.fog = new THREE.FogExp2( 0x3A3532, 0.04 ); // (color, density)

    //create geometry using simplex noise 
    var geometry = new THREE.PlaneGeometry(1, 1, width - 1, height - 1), // (width, height, widthSegments, heightSegments)
        simplexNoise = new SimplexNoise(),
        octaves = 4,
        persistence = 2,
        frequency,
        amplitude,
        totalAmplitude,
        noise;
    
    for (var x = 0; x < width; x++) {
        for (var y = 0; y < height; y++) {
            noise = 0;
            frequency = 4;
            amplitude = 0.05; 
            totalAmplitude = .3;
            for (var i = 0; i < octaves; i++) {
                noise += (simplexNoise.noise2D(x / frequency, y / frequency) / 3 + 0.5) * amplitude;
                totalAmplitude += amplitude;
                amplitude *= persistence;
                frequency *= (i === 0) ? 3 : 2;
            }
            noise /= totalAmplitude;
            geometry.vertices[x + y * width].z += (noise - 0.5) * 3;
        }
    } //*/

    geometry.dynamic = true;
    geometry.verticesNeedUpdate = true;
    geometry.computeFaceNormals();
    geometry.computeVertexNormals();
    geometry.normalsNeedUpdate = true;

    //create face coloring
    for (i = 0; i < geometry.faces.length; i++) {
        var color;
        color = 0xAD8B6F;
    }
    geometry.colorsNeedUpdate = true; //*/

    //create material
    var material = new THREE.MeshLambertMaterial({
        vertexColors: THREE.VertexColors,
        shading: THREE.FlatShading,
        //wireframe: true
    });

    //apply material to geometry
    var mesh = new THREE.Mesh(geometry, material);
    mesh.scale.set(5, 5, 0.4)
    mesh.scale.multiplyScalar(15);

    //create lighting
    var ambientLight = new THREE.AmbientLight(0xAD8B6F); // (color)
    var primaryLight = new THREE.DirectionalLight(0xffffff, 0.3); // (color, intensity)
    primaryLight.position.set(2, 10, 10);
    var secondaryLight = new THREE.DirectionalLight(0xffffff, 0.1); // (color, intensity)
    secondaryLight.position.set(-2, 0, 10);

    //create camera
    var camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100); // (fov, aspect, near, far)
    camera.rotation.x = 84 * Math.PI / 180;
    camera.position.set(0, -30, 3);
    //camera.lookAt(mesh.position);

    //add objects to scene
    scene.add(mesh);
    scene.add(ambientLight);
    scene.add(primaryLight);
    scene.add(secondaryLight);
    scene.add(camera);

    //create canvas for three.js

    var canvas = document.createElement('canvas');

        canvas.className = "hero-mountains";
    
    var mountainHolder = document.querySelector(".hero-mountain-holder");
    mountainHolder.appendChild(canvas);

    //create renderer
    
    const renderer = new THREE.WebGLRenderer({
        canvas: document.querySelector('.hero-mountains'),
        alpha: true
    })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight);
      
    //create user controls
    const controls = new THREE.OrbitControls(camera);
    controls.autoRotate = true;
    controls.enabled = false;
    controls.minPolarAngle = 90 * Math.PI / 180;
	controls.maxPolarAngle = 210 * Math.PI / 180;
    controls.minAzimuthAngle = 0;
	controls.maxAzimuthAngle = 0;
    controls.noKeys = true;
    document.body.addEventListener("mousedown", function(e) {
       controls.enabled = true;
    });
    document.body.addEventListener("mouseup", function(e) {
        controls.enabled = false;
    });//*/

    var render = function() {

        //rotate terrain
        mesh.rotation.z -= .01 * Math.PI / 180;
        mesh.rotation.y = -0.5;
        renderer.render(scene, camera);
    };

    //animation loop
    var animate = function() {

        requestAnimationFrame(animate);

        render();
        //stats.update();
    };

    //handle resizing
    window.addEventListener('resize', onWindowResize, false);

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate();

}();