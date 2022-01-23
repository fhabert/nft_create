const nftGenerate = () => {
    let play = false;
    const colors = [0xB6401A, 0xF2BFC1, 0x6E2F8D, 0x04798F, 0xBF332C];
    const planet = document.getElementById("planet");
    class NFT {
        constructor() {
            this.scene = new THREE.Scene();
            this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            this.renderer = new THREE.WebGLRenderer();
            this.cube = "";
            this.setup = this.setup();
        }
        setup() {
            this.renderer.setSize( window.innerWidth, window.innerHeight );
            if (planet) {
                planet.appendChild(this.renderer.domElement);
            }
        }
    }
    const getEllipse = (nft) => {
        let rotateArc = [0.5, -0.5, -1.6, -2.7, 2.65, 1.5];
        let curves = [];
        let ellipses = [];
        for(let rotate of rotateArc) {
            const curve = new THREE.EllipseCurve(0, 0, -2, 2, 0, Math.PI*(1/3), false, rotate);
            curves.push(curve);
        };
        for (let curve of curves) {
            const pointsC = curve.getPoints( 20 );
            const geometryC = new THREE.BufferGeometry().setFromPoints( pointsC );
            const materialC = new THREE.LineBasicMaterial( { color : 0x0000ff } );
            const ellipse = new THREE.Line( geometryC, materialC );
            ellipses.push(ellipse);
            nft.scene.add(ellipse);
        };
        return ellipses;
    }
    
    const plotBox = (nft) => {
        let color = colors[Math.floor((Math.random() * colors.length))];
        const geometry =  new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({color: color});
        const cube = new THREE.Mesh(geometry, material);
        nft.scene.add(cube);
        nft.camera.position.z = 5;
        return cube;
    }
    
    const setLines = (nft) => {
        const points = [];
        const material_line = new THREE.MeshBasicMaterial({color: 0xf0fff0});
        const vectors = [new THREE.Vector3( - 10, -5, 10 ), new THREE.Vector3( 10, -5, 10 ), new THREE.Vector3( 10, 5, 10 ), new THREE.Vector3( -10, 5, 10 ),
            new THREE.Vector3( 0, 10, -5 ), new THREE.Vector3( 0, -10, 5 )];
        for (let vector of vectors) {
            points.push(vector);
            points.push(new THREE.Vector3( 0, 0, 0 ));
        }
        const lines = new THREE.BufferGeometry().setFromPoints( points );
        const line = new THREE.Line( lines, material_line );
        nft.scene.add( line );
    }

    const btnMusic = document.getElementById("btnMusic");
    btnMusic.addEventListener('click', (e) => {
        play = !play;
        if (play) {
            btnMusic.innerHTML = "Stop";
            initGame();
        } else {
            btnMusic.innerHTML = "Play";
        }
    })

    const initGame = () => {
        const nftJs = new NFT();
        const cube = plotBox(nftJs);
        setLines(nftJs);
        const ellipses = getEllipse(nftJs);
        let [counter, counter2, counter3] = [2, 2, 2];
        let cubeScale;
        let factors = [0.008, 0.009, 0.01];
        let factor = factors[Math.floor(Math.random() * 3)];
        let colorLine = colors[Math.floor((Math.random() * colors.length))];
        let distance = 0.005;
        const animate = () => {
            nftJs.camera.translateZ( distance );
            nftJs.camera.translateX( distance );
            if (play) {
                requestAnimationFrame( animate );
            } else {
                while (nftJs.scene.children.length)
                    {
                        nftJs.scene.remove(nftJs.scene.children[0]);
                    }
                delete nftJs;
                nftJs.renderer.dispose();
                nftJs.scene.dispose;
                planet.innerHTML = "";
            }
            if (cube) {
                cube.rotation.x += 0.01;
                cube.rotation.y += 0.01;
                cube.rotation.z += 0.005;
            }
            if (ellipses) {
                const curves = [new THREE.EllipseCurve(0, 0, -counter, counter, 0, Math.PI*(1/3), false, 0.5),
                    new THREE.EllipseCurve(0, 0, -counter, counter, 0, Math.PI*(1/3), false, -0.5), 
                    new THREE.EllipseCurve(0, 0, -counter2, counter2, 0, Math.PI*(1/3), false, -1.6),
                    new THREE.EllipseCurve(0, 0, -counter3, counter3, 0, Math.PI*(1/3), false, -2.7),
                    new THREE.EllipseCurve(0, 0, -counter2, counter2, 0, Math.PI*(1/3), false, 2.65),
                    new THREE.EllipseCurve(0, 0, -counter3, counter3, 0, Math.PI*(1/3), false, 1.5)];
                const curveNames = ["ellipseLeft", "ellipseLeftR", "ellipseLeftRR", "ellipseRight",
                                "ellipseRightR", "ellipseRightRR"];
                for (let i = 0; i < curves.length; i++) {
                    const pointsC = curves[i].getPoints( 20 );
                    const geometryC = new THREE.BufferGeometry().setFromPoints( pointsC );
                    const materialC = new THREE.LineBasicMaterial( { color : colorLine } );
                    const ellipse = new THREE.Line( geometryC, materialC );
                    ellipse.name = curveNames[i];
                    nftJs.scene.add(ellipse);
                }
                counter += Math.random() * factor * 0.8;
                counter2 += Math.random() * factor;
                counter3 += Math.random() * factor * 0.5;
                if (counter > 3.8 || counter2 > 3.8 || counter3 > 3.8) {
                    const selectedC = [];
                    for (const name of curveNames) {
                        const curveS = nftJs.scene.getObjectByName(name);
                        selectedC.push(curveS);
                    }
                    for (let i = 0; i < selectedC.length; i++) {
                        let curve = selectedC[i];
                        let name = curveNames[i];
                        while (curve !== undefined) {
                            nftJs.scene.remove(curve);
                            curve = nftJs.scene.getObjectByName(name);
                        }
                    }
                    [counter, counter2, counter3] = [2, 2, 2];
                    if (cubeScale == 1) {
                        cubeScale = 1.5;
                    } else {
                        cubeScale = 1;
                    }
                    distance = -distance;
                    cube.timeScale = 0.2;
                    [cube.scale.x, cube.scale.y, cube.scale.z] = [cubeScale, cubeScale, cubeScale];
                    factor = factors[Math.floor(Math.random() * 3)];
                }
            }
            nftJs.renderer.render( nftJs.scene, nftJs.camera );
        }
        animate();
    }
}

nftGenerate();