import * as THREE from './three.module.js';
export {Net};
class Net{
    object;
    constructor(){
        const DAMPING = 0.03;
        const DRAG = 1 - DAMPING;
        const MASS = 0.3;//质量
        const restDistance = 25;//面片块大小
        const xSegs = 10;//水平方向的面片块数
        const ySegs = 10;//垂直方向的面片块数
        const clothFunction = plane( restDistance * xSegs, restDistance * ySegs );
        function plane( width, height ) {//布面的宽、高
            return function ( u, v, target ) {
                const x = ( u - 0.5 ) * width;
                const y = ( v + 0.5 ) * height;
                const z = 0;
                target.set( x, y, z );
            };
        }
        const cloth = new Cloth( xSegs, ySegs );
        const gravity = new THREE.Vector3( 0, - 981 * 1.4, 0 ).multiplyScalar( MASS );//重力=加速度*质量//F=A*M
        const TIMESTEP = 18 / 1000;//时间步长
        const TIMESTEP_SQ = Math.pow(TIMESTEP ,2);//时间步长的平方
        let pins = [];

        const windForce = new THREE.Vector3();//风力
        const tmpForce = new THREE.Vector3();

        function Particle( x, y, z, mass ) {
            this.position = new THREE.Vector3();
            this.previous = new THREE.Vector3();
            this.original = new THREE.Vector3();
            this.a = new THREE.Vector3( 0, 0, 0 ); // acceleration
            this.mass = mass;
            this.invMass = 1 / mass;
            this.tmp = new THREE.Vector3();
            this.tmp2 = new THREE.Vector3();

            // init
            clothFunction( x, y, this.position ); // position
            clothFunction( x, y, this.previous ); // previous
            clothFunction( x, y, this.original );
        }
        // Force -> Acceleration力对应加速度
        Particle.prototype.addForce = function ( force ) {
            this.a.add(
                this.tmp2.copy( force ).multiplyScalar( this.invMass )
            );
        };
        // Performs Verlet integration 执行Verlet集成 //Verlet 贷款
        Particle.prototype.integrate = function ( timesq ) {
            const newPos = this.tmp.subVectors( this.position, this.previous );
            newPos.multiplyScalar( DRAG ).add( this.position );
            newPos.add( this.a.multiplyScalar( timesq ) );

            this.tmp = this.previous;
            this.previous = this.position;
            this.position = newPos;

            this.a.set( 0, 0, 0 );

        };
        const diff = new THREE.Vector3();
        function satisfyConstraints( p1, p2, distance ) {

            diff.subVectors( p2.position, p1.position );
            const currentDist = diff.length();
            if ( currentDist === 0 ) return; // prevents division by 0
            const correction = diff.multiplyScalar( 1 - distance / currentDist );
            const correctionHalf = correction.multiplyScalar( 0.5 );
            p1.position.add( correctionHalf );
            p2.position.sub( correctionHalf );

        }
        function Cloth( w, h ) {//布料模拟
            w = w || 10;
            h = h || 10;
            this.w = w;
            this.h = h;
            const particles = [];//粒子
            const constraints = [];//约束

            // Create particles
            for ( let v = 0; v <= h; v ++ ) {
                for ( let u = 0; u <= w; u ++ ) {
                    particles.push(
                        new Particle( u / w, v / h, 0, MASS )
                    );
                }
            }

            // Structural
            for ( let v = 0; v < h; v ++ ) {

                for ( let u = 0; u < w; u ++ ) {

                    constraints.push( [
                        particles[ index( u, v ) ],
                        particles[ index( u, v + 1 ) ],
                        restDistance
                    ] );

                    constraints.push( [
                        particles[ index( u, v ) ],
                        particles[ index( u + 1, v ) ],
                        restDistance
                    ] );

                }

            }

            for ( let u = w, v = 0; v < h; v ++ ) {

                constraints.push( [
                    particles[ index( u, v ) ],
                    particles[ index( u, v + 1 ) ],
                    restDistance

                ] );

            }

            for ( let v = h, u = 0; u < w; u ++ ) {

                constraints.push( [
                    particles[ index( u, v ) ],
                    particles[ index( u + 1, v ) ],
                    restDistance
                ] );

            }


            this.particles = particles;
            this.constraints = constraints;

            function index( u, v ) {

                return u + v * ( w + 1 );

            }

            this.index = index;

        }


        const pinsFormation = [];
        pinsFormation.push( [ 6 ] );
        pinsFormation.push( [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ] );
        pinsFormation.push( [ 0 ] );
        pinsFormation.push( [] );
        pinsFormation.push( [ 0, cloth.w ] );
        pins = pinsFormation[ 1 ];



        // cloth material
        const loader = new THREE.TextureLoader();
        const clothTexture = loader.load( './img/circuit_pattern.png' );
        clothTexture.anisotropy = 16;

        var clothMaterial = new THREE.MeshPhongMaterial( {
            color:0x588a57,
            side: THREE.DoubleSide,
            alphaTest: 0.9
        } );

        // cloth geometry
        var clothGeometry = new THREE.ParametricBufferGeometry( clothFunction, cloth.w, cloth.h );
        // cloth mesh
        this.object = new THREE.Mesh( clothGeometry, clothMaterial );
        this.object.castShadow = true;
        //scene.add( object );

        animate( 0 );
        function animate( time0 ) {
            requestAnimationFrame( animate );
            const p = cloth.particles;
            for ( let i = 0, il = p.length; i < il; i ++ ) {
                const v = p[ i ].position;
                clothGeometry.attributes.position.setXYZ( i, v.x, v.y, v.z );
            }
            clothGeometry.attributes.position.needsUpdate = true;
            clothGeometry.computeVertexNormals();
            simulate( time0  );
        }
        function simulate( now ) {//开始模拟
            const particles = cloth.particles;
            // Aerodynamics forces空气动力
            for ( let i = 0, il = particles.length; i < il; i ++ ) {
                const particle = particles[ i ];
                particle.addForce( gravity );//添加重力
                particle.integrate( TIMESTEP_SQ );//时间步长的平方//integrate整合
            }

            // Start Constraints开始约束
            const constraints = cloth.constraints;
            const il = constraints.length;
            for ( let i = 0; i < il; i ++ ) {
                const constraint = constraints[ i ];
                satisfyConstraints( constraint[ 0 ], constraint[ 1 ], constraint[ 2 ] );
            }

            //生成风
            const windStrength = Math.cos( now / 7000 ) * 20 + 40;//风力大小
            windForce.set( Math.sin( now / 2000 ), Math.cos( now / 3000 ), Math.sin( now / 1000 ) );//风力方向
            windForce.normalize();//单位化
            windForce.multiplyScalar( windStrength );//方向*大小

            //模拟风
            let indx;
            const normal = new THREE.Vector3();
            const indices = clothGeometry.index;
            const normals = clothGeometry.attributes.normal;

            for ( let i = 0, il = indices.count; i < il; i += 3 ) {
                for ( let j = 0; j < 3; j ++ ) {
                    indx = indices.getX( i + j );
                    normal.fromBufferAttribute( normals, indx );
                    tmpForce.copy( normal ).normalize().multiplyScalar( normal.dot( windForce ) );
                    particles[ indx ].addForce( tmpForce );
                }
            }

            // Pin Constraints销约束//pin 别针//丝网挂在了栏杆上
            for ( let i = 0, il = pins.length; i < il; i ++ ) {
                const xy = pins[ i ];
                const p = particles[ xy ];
                p.position.copy( p.original );
                p.previous.copy( p.original );
            }
        }//完成模拟
    }

}
