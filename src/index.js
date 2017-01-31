'use strict';

export default class ConditionalPromise {
  constructor(callback) {
    this._callback = callback
    return this
  }

  static resolve(data) {
    return new ConditionalPromise(resolve => resolve(data))
  }

  static reject(data) {
	return new ConditionalPromise(() => {throw data})
  }

  then(success, fail) {
    try {
      this._callback && this._callback(result => {
        let sData = success && success(result)
        if (sData && typeof sData.then === 'function') {
          sData.then(this._nextSucces, this._nextFail)
        } else {
          this._nextSucces && this._nextSucces(sData)
        }
      }, result => {
        let fData = fail?fail(result):result
        this._nextFail && this._nextFail(fData)
      })
    } catch (e) {
      let fData = fail?fail(e):e
      this._nextFail && this._nextFail(fData)
    }

    return this._next()
  }

  if(condition){
    try {
      this._callback && this._callback(result => {
        if (condition(result)) {
          this._nextSucces && this._nextSucces(result)
        } else {
          this._nextFail && this._nextFail(result)
        }
      })
    } catch (e) {
      this._nextFail && this._nextFail(e)
    }
    return this._next()
  }

  catch(fail) {
    return this.then(null, fail);
  }

  else(fail) {
    return this.then(null, fail);
  }

  _next() {
    return new ConditionalPromise((nextSucces, nextFail) => {
      this._nextSucces = nextSucces
      this._nextFail = nextFail
    })
  }
}

