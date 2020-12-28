var InstancedGroup= require('../js/InstancedGroup.js');
var expect = require('chai').expect;
describe('InstancedGroup测试套件',//测试套件
    function() {
        var THREE_Type=function () {
                    this.Object3D=function(){
                            return {};
                    }
        };
        var THREE=new THREE_Type();
        var myInstancedGroup=new InstancedGroup(
            THREE,
            1,
            null,null,//这些mesh的网格应该一致
            false
        );
        before(function() {
        });//在本区块的所有测试用例之前执行
        beforeEach(function() {
        });//在本区块的每个测试用例之前执行
        it('测试用例01', function() {//测试用例
                /*var loader= new THREE.GLTFLoader();
                loader.load("", (glb) => {
                        console.log(glb);
                });*/
                var result=0;
                expect(result).to.be.equal(0);
            }
        );
        it('测试用例02', function() {//测试用例
                var result=0;
                expect(result).to.be.equal(0);
            }
        );
        afterEach(function() {
        });//在本区块的每个测试用例之后执行
        after(function() {
        });//在本区块的所有测试用例之后执行
    }
);