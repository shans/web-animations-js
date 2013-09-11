var WA = _WebAnimationsWAXUtilities;

function WaxReplacePixelLength(startValue, endValue, startTime, endTime, target, property) {
  this.startValue = startValue;
  this.endValue = endValue;
  this.startTime = startTime;
  this.endTime = endTime;
  this.target = target;
  this.property = property;
  this.length = endTime - startTime;
  this.delta = endValue - startValue;
  this._apply = function(t) {
    if (t < this.startTime) {
      return true;
    }
    this.apply = function(t) {
      if (t < this.endTime) {
        var result = this.startValue + this.delta * (t - this.startTime) / this.length;
        this.target.style[property] = result + 'px';
        return true;
      }
      this.target.style[property] = this.endValue + 'px';
      return false;
    }
    return this.apply(t);
  }
  this.apply = this._apply;
  this.reset = function() {
    this.apply = this._apply;
  }
}

var waxList = [];

function waxAdd(wax) {
  waxList.push(wax);
}

function waxRemove(wax) {
  waxList.splice(waxList.indexOf(wax), 1);
}

function isA(a, b) {
  while (a.__proto__ != null) {
    if (a.__proto__ == b.prototype) {
      return true;
    }
    a = a.__proto__;
  }
}

function waxelerate(obj) {
  var result = undefined;
  if (isA(obj, Animation)) {
    var result = waxelerateAnimation(obj);
  }
  return result;
}

function waxelerateAnimation(anim) {
  if (isA(anim.effect, KeyframeAnimationEffect)) {
    return waxelerateKeyframeAnimationEffect(anim);
  }
  return false;
}

function waxelerateKeyframeAnimationEffect(anim) {
  var keyframes = anim.effect._propertySpecificKeyframes();
  var property = undefined;
  for (var prop in keyframes) {
    if (property) {
      return false;
    }
    property = prop;
  }
  keyframes = keyframes[property];
  if (keyframes.length == 2 && keyframes[0].composite != 'add' && keyframes[1].composite != 'add') {
    return waxelerateSimpleReplaceKeyframeAnimationEffect(anim, property, keyframes);
  }
  return false;
}

function waxelerateSimpleReplaceKeyframeAnimationEffect(anim, property, keyframes) {
  var start = WA.lengthType.fromCssValue(keyframes[0].cssValue);
  var end = WA.lengthType.fromCssValue(keyframes[1].cssValue);
  return new WaxReplacePixelLength(start.px, end.px, anim.startTime + anim.specified.delay, anim.endTime, anim.target, property);
}

function waxUpdate(t) {
  var l = waxList.length;
  for (var i = 0; i < l; i++) {
    var more = waxList[i].apply(t);
    if (!more) {
      waxList.splice(i, 1);
      i -= 1;
      l -= 1;
    }
  }
  return waxList.length > 0;
}
