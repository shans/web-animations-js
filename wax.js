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
  this.apply = function(t) {
    if (t < startTime) {
      return true;
    }
    this.apply = function(t) {
      if (t < endTime) {
        var result = this.startValue + this.delta * (t - startTime) / this.length;
        this.target.style[property] = result + 'px';
        return true;
      }
      return false;
    }
    this.apply(t);
  }
}

var waxList = [];

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
  if (result) {
    waxList.push(result);
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
  return new WaxReplacePixelLength(start.px, end.px, anim.startTime, anim.endTime, anim.target, property);
}

function waxUpdate(t) {
  for (var i = 0; i < waxList.length; i++) {
    var more = waxList[i].apply(t);
    if (!more) {
      waxList = waxList.splice(i, 1);
      i -= 1;
    }
  }
  return waxList.length > 0;
}
