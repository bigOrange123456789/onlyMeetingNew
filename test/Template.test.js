//var Obj= require('../src/Obj.js');
var expect = require('chai').expect;
describe('测试套件00',//测试套件
    function() {
        before(function() {
        });//在本区块的所有测试用例之前执行
        beforeEach(function() {
        });//在本区块的每个测试用例之前执行
        it('测试用例01', function() {//测试用例
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