import { fakeAsync, flush, flushMicrotasks, tick } from "@angular/core/testing";
import { of } from "rxjs";
import { delay } from 'rxjs/operators';

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

  it('Asynchrous test example - plain promise', fakeAsync(() => {

    //In this example we have 2 different types of queues operations, microtasks such as Promise, and macrotasks or tasks like setTimeout, setInterval, click... microtasks are executed first and then when the microtasks queue is empty the macrotask queue is executed

    //console.log('creating promise');

    /* setTimeout(() => console.log('first setTimeout() callback triggered'));

    setTimeout(() => console.log('second setTimeout() callback triggered')); */

    Promise.resolve().then(() => {
      //console.log('promise first then() evaluated successfully');

      return Promise.resolve();
    }).then(() => {

      //console.log('promise second then() evaluated successfully');

      test = true;
    });

    //Flush any pending microtasks.
    flushMicrotasks();

    //console.log('running plain promise assertions');

    expect(test).toBeTruthy();

  }));

  it('Asynchrous test example - Promises + setTimeout()', fakeAsync(() => {

    let counter = 0;

    Promise.resolve()
      .then(() => {

        counter += 10;

        setTimeout(() => {

          counter += 1;

        }, timeout);

      });

    //console.log(counter);//0
    expect(counter).toBe(0);
    flushMicrotasks();
    //console.log(counter);//10
    expect(counter).toBe(10);
    tick(500);
    //console.log(counter);//10
    expect(counter).toBe(10);
    tick(500);
    //console.log(counter);//11
    expect(counter).toBe(11);
  }));

  it('Asynchrous test example - Observable', () => {

    //console.log('creating a new Observable');

    //setting test flag into an Observable
    const test$ = of(test);

    //By creating an observable we make sure that the following code is executed inmediatly, right before the assertion
    test$.subscribe(() => {
      test = true;
    });

    //console.log('running Observable assertions');
    expect(test).toBe(true);

  });

  fit('Asynchrous test example - Asynchronous Observable', fakeAsync(() => {

    console.log('creating a new Observable');

    //setting test flag into an Observable
    const test$ = of(test).pipe(delay(timeout));

    //By creating an observable we make sure that the following code is executed inmediatly, right before the assertion
    test$.subscribe(() => {
      test = true;
    });

    tick(timeout);
    console.log('running Observable assertions');
    expect(test).toBe(true);

  }));



});
