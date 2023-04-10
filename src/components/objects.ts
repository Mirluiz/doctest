import * as THREE from "three";

const floor = (): Array<THREE.Mesh> => {
  let geometry = new THREE.PlaneGeometry(50, 50, 100);
  let material = new THREE.MeshBasicMaterial({
    color: 0x5fc314,
  });
  let mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(25, 25, 0);
  return [mesh];
};

const walls = (): Array<THREE.Mesh> => {
  let createMesh = (
    x: number,
    y: number,
    z: number = 0,
    rX: number = 0,
    rY: number = 0,
    rZ: number = 0
  ): THREE.Mesh => {
    let geometry = new THREE.BoxGeometry(1, 20, 2);
    let material = new THREE.MeshBasicMaterial({
      color: 0x000000,
    });
    let mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.set(rX, rY, rZ);
    mesh.position.set(x, y, z);
    return mesh;
  };

  return [
    createMesh(0, 10, 1),
    createMesh(0, 40, 1),
    createMesh(50, 10, 1),
    createMesh(50, 30, 1),
    createMesh(50, 40, 1),
    createMesh(10, 0, 1, 0, 0, (90 * Math.PI) / 180),
    createMesh(30, 0, 1, 0, 0, (90 * Math.PI) / 180),
    createMesh(40, 0, 1, 0, 0, (90 * Math.PI) / 180),

    createMesh(10, 50, 1, 0, 0, (90 * Math.PI) / 180),
    createMesh(30, 50, 1, 0, 0, (90 * Math.PI) / 180),
    createMesh(40, 50, 1, 0, 0, (90 * Math.PI) / 180),
  ];
};
const spheres = (): Array<THREE.Mesh> => {
  let geometry = new THREE.SphereGeometry(20, 32, 32);
  const material = new THREE.MeshPhongMaterial({
    color: 0xffffff,
  });
  let mesh = new THREE.Mesh(geometry, material);
  mesh.receiveShadow = true;
  mesh.castShadow = true;
  mesh.position.set(10, 10, 10);

  return [mesh];
};
const trees = (): Array<THREE.Mesh> => {
  return [];
};

const gate = (): Array<THREE.Mesh> => {
  return [];
};

export { floor, walls, spheres };
