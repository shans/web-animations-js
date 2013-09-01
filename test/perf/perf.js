/**
 * Copyright 2013 Google Inc. All Rights Reserved.
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *   http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function(){
'use strict';

var disregardFramesCount = 10;
var framesPerTimeReading = 10;
var maxTimeReadings = 60;
var maxFPSReadings = 31;

var frameCount = 0;
var timeReadings = [];
var fpsReadings = [];
var onCompleteHandler;
var outputElement;

var getTime = (typeof window.performance === 'object' &&
    typeof window.performance.now === 'function') ?
    function() { return window.performance.now(); } :
    function() { return Date.now(); };

var raf = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    function(callback) { setTimeout(callback, 1000 / 60); };

function disregardFrames() {
  raf((frameCount++ < disregardFramesCount) ? disregardFrames : trackFrameRate);
}

function trackFrameRate()
{
  frameCount++;
  if (frameCount % framesPerTimeReading === 0) {
    timeReadings.unshift(getTime());
    if (timeReadings.length > maxTimeReadings) {
      timeReadings.pop();
    }
    if (timeReadings.length > 1) {
      var fpsReading = 1000 * (timeReadings.length - 1) * framesPerTimeReading /
          (timeReadings[0] - timeReadings[timeReadings.length - 1]);
      fpsReadings.push(fpsReading);
      output(fpsReading + ' FPS\n');
      if (fpsReadings.length >= maxFPSReadings) {
        outputSummary();
        if (typeof onCompleteHandler === 'function') {
          onCompleteHandler();
        }
        return;
      }
    }
  }
  raf(trackFrameRate);
}

function output(text) {
  outputElement.value += text;
}

function outputSummary() {
  var total = 0;
  fpsReadings.forEach(function(fpsReading) { total += fpsReading; });
  var average = total / maxFPSReadings;
  output('Average: ' + average + ' FPS\n');
  var temp = 0;
  fpsReadings.forEach(function(fpsReading) {
    temp += (fpsReading - average) * (fpsReading - average);
  });
  output('Stddev: ' + Math.sqrt(temp / fpsReadings.length) + ' FPS\n');
  fpsReadings.sort();
  output('Min: ' + fpsReadings[0] + ' FPS\n');
  output('Max: ' + fpsReadings[fpsReadings.length - 1] + ' FPS\n');
  var median = fpsReadings[fpsReadings.length >> 1];
  if (fpsReadings.length % 2 !== 0) {
    median = (median + fpsReadings[(fpsReadings.length >> 1) + 1]) / 2;
  }
  output('Median: ' + median + ' FPS\n');
}

var start = function() {
  outputElement = document.createElement('textarea');
  outputElement.setAttribute('rows', maxFPSReadings + 6);
  outputElement.setAttribute('cols', 32);
  document.body.appendChild(outputElement);

  output('Disregarding initial ' + disregardFramesCount + ' frames.\n')
  raf(disregardFrames);
};

window.Perf = {
  set oncomplete(callback) {
    onCompleteHandler = callback;
  },
  start: start,
};

})();
