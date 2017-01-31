/*eslint-env node*/
'use strict';

const expect = require('chai').expect
const ConditionalPromise = require('../dist')

describe('ConditionalPromise', () => {

    it('shoud be a function', () => {
        expect(typeof ConditionalPromise).to.equal('function')
    })

    it('should process async promises', done => {
        delay(1, 'ConditionalPromise')
            .then(value => {
                expect(value).to.equal('ConditionalPromise')
                return 'yes';
            })
            .then(value => {
                expect(value).to.equal('yes')
                return delay(2, 'no')
            })
            .then(value => {
                expect(value).to.equal('no')
            })
            .then(() => ConditionalPromise.resolve(42))
            .then(value => expect(value).to.equal(42))
            .then(() => ConditionalPromise.reject(8))
            .then(value => expect(value).to.equal(false))
            .catch(value => {
                expect(value).to.equal(8)
                done()
            })
            // .then(()=>{
            //     done()
            // })
    })

    it('should process if conditions', done => {
        delay(1, 42)
            .if(value => value > 0)
            .then(value => {
                expect(value).to.equal(42)
                return value
            })
            .if(value => value < 0)
            .then(value => expect(value).to.equal(false))
            .else(value => {
                expect(value).to.equal(42)
                done()
            })
            // .then(()=>{
            //     done()
            // })

    })

    function delay(interval, test) {
        return new ConditionalPromise((resolve) => {
            setTimeout(() => {
                resolve(test)
            }, interval)
        })
    }



})