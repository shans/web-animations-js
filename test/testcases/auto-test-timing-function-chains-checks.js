timing_test(function() {
  at(0, function() {
    assert_styles(".anim",{'left':'0px'});
  });
  at(0.5, function() {
    assert_styles(".anim",{'left':'0px'});
  });
  at(1, function() {
    assert_styles(".anim",{'left':'0px'});
  });
  at(1.5, function() {
    assert_styles(".anim", [
      {'left':'86.37px'},
      {'left':'31.54px'},
      {'left':'12.5px'},
      {'left':'329.1px'},
    ]);
  });
  at(2, function() {
    assert_styles(".anim", [
      {'left':'138.7px'},
      {'left':'100px'},
      {'left':'100px'},
      {'left':'350px'},
    ]);
  });
  at(2.5, function() {
    assert_styles(".anim", [
      {'left':'150px'},
      {'left':'180.2px'},
      {'left':'150px'},
      {'left':'300px'},
    ]);
  });
  at(3, function() {
    assert_styles(".anim", [
      {'left':'236.4px'},
      {'left':'200px'},
      {'left':'200px'},
      {'left':'250px'},
    ]);
  });
  at(3.5, function() {
    assert_styles(".anim", [
      {'left':'288.7px'},
      {'left':'268.5px'},
      {'left':'250px'},
      {'left':'216.7px'},
    ]);
  });
  at(4, function() {
    assert_styles(".anim",{'left':'300px'});
  });
}, "Auto generated tests");