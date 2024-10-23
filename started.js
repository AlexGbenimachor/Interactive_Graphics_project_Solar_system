
var starparticles = new THREE.Geometry();
var starMaterial = new THREE.PointsMaterial({color:0xffffff, 
size:20, sizeAttenuation:false
});

var stars;

for( var i=0; i < 5000; i++){
     var x= Math.random * 400-200,
         y= Math.random * 400-200,
         z= Math.random * 400-200,

         particle = THREE.Vector3(x, y, z); 

}
  //starparticles.multiplyScalar(6300);

 starparticles.vertices.push(particle);


 stars= new THREE.Points(starparticles, starMaterial);

scene.add(stars);


