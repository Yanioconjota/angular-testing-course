import { fakeAsync, flush, tick } from "@angular/core/testing";

fdescribe('Async testing example', () => {

  let test = false;
  const timeout = 1000;

  it('Asynchrous test example with jasmine done()', (done: DoneFn) => {

    setTimeout(() => {

      //console.log('running assertions');

      test = true;

      expect(test).toBeTruthy();

      done();

    }, timeout);

  });

  //Wraps a function to be executed in the fakeAsync zone
  //If there are any pending timers at the end of the function, an exception is thrown.
  it('Asynchrous test example - setTimeout()', fakeAsync(() => {

    setTimeout(() => {}, timeout);

    setTimeout(() => {

      //console.log('running setTimeout() assertions');

      test = true;

    }, timeout);
    //The tick() option is a flag called processNewMacroTasksSynchronously, which determines whether or not to invoke new macroTasks.
    tick(timeout);
    expect(test).toBeTruthy();

  }));

  it('Asynchrous test example - with more than one setTimeout()', fakeAsync(() => {

    setTimeout(() => {}, timeout);

    setTimeout(() => {

      //console.log('running with more than one setTimeout() assertions');

      test = true;

    }, timeout);

    //Flushes any pending microtasks and simulates the asynchronous passage of time for the timers in the fakeAsync zone by draining the macrotask queue until it is empty.
    flush();

    expect(test).toBeTruthy();

  }));

  /* fit('Asynchrous test example - plain promise', () => {

  }); */


});
