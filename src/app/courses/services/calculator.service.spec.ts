import { TestBed } from "@angular/core/testing";
import { CalculatorService } from './calculator.service';
import { LoggerService } from "./logger.service";

describe('Calculator service', () => {

  let calculator: CalculatorService;
  let loggerSpy: any;

  beforeEach(() => {
    //1- Setup phase: prepare the component or service to test
    console.log('Calling before each');
    //Fake dependency injection using spy
    //The first param is the name of the implementation and the second one is an array of methods
    loggerSpy = jasmine.createSpyObj('LoggerService', ['log']);

    //TestBed Configures and initializes environment for unit testing and provides methods for creating components and services in unit tests.

    //configureTestingModule method allows overriding default providers, directives, pipes, modules of the test injector, which are defined in test_injector.js
    TestBed.configureTestingModule({
      providers: [
        CalculatorService,
        //After we set up our providers we pass an object or objects with their dependendencies, provide is the name of the dependency and useVale uses the mock value created with the spy
        { provide: LoggerService, useValue: loggerSpy }
      ]
    });
    //Instead of calling an instace of our service calculator = new CalculatorService(loggerSpy); we inject the mock created in the testing module
    calculator = TestBed.inject(CalculatorService);
  });


  it('should add two numbers', () => {
    console.log('Calling add test');
    //2- Execution: Triggers the operation to test
    const result = calculator.add(2,2);
    //3 - assertions: Checks if the executions is succesful
    expect(result).toBe(4);
    expect(loggerSpy.log).toHaveBeenCalledTimes(1);
  });

  it('should subtract two numbers', () => {
   console.log('Calling subtract test');
    const result = calculator.subtract(2,2);
    //We can pass a second argument as an expectation fail output
    expect(result).toBe(0, 'Unexpexted subtraction result');
    expect(loggerSpy.log).toHaveBeenCalledTimes(1);
  });


});
