import * as THREE from 'three'


export default class BoxModel extends THREE.Object3D {
    constructor( scale, position) {
      super()
    
    const geometry = new THREE.BoxGeometry( 1, 1, 1 );
    const material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
  
    const mesh = new THREE.Mesh(geometry, material)
        mesh.scale.set(1, scale, 1)
        mesh.position.copy(position)
      this.add(mesh)
    }
  }