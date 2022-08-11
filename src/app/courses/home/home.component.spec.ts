import {async, ComponentFixture, fakeAsync, flush, flushMicrotasks, TestBed, waitForAsync} from '@angular/core/testing';
import {CoursesModule} from '../courses.module';
import {DebugElement} from '@angular/core';

import {HomeComponent} from './home.component';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {CoursesService} from '../services/courses.service';
import {HttpClient} from '@angular/common/http';
import {COURSES} from '../../../../server/db-data';
import {setupCourses} from '../common/setup-test-data';
import {By} from '@angular/platform-browser';
import {of} from 'rxjs';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {click} from '../common/test-utils';




describe('HomeComponent', () => {

  let fixture: ComponentFixture<HomeComponent>;
  let component:HomeComponent;
  let el: DebugElement;
  let coursesService: any;

  //we call the findAllCourses method, it returns an Observable<Course[]>, and we mock the result by using the setupCourses() utility and filter the response by category
  const beginnerCourses = setupCourses().filter(course => course.category === 'BEGINNER');

  const advancedCourses = setupCourses().filter(course => course.category === 'ADVANCED');

  beforeEach(waitForAsync(() => {

    const coursesServiceSpy = jasmine.createSpyObj('CoursesService', ['findAllCourses']);

    TestBed.configureTestingModule({
      imports: [
        CoursesModule,
        //The required material animation module so the component doesn't break
        NoopAnimationsModule
      ],
      providers: [
          { provide: CoursesService, useValue: coursesServiceSpy },
        ]
    }).compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(HomeComponent);
        component = fixture.componentInstance;
        el = fixture.debugElement;
        //mock injection of our service to access its methods
        coursesService = TestBed.inject(CoursesService);
      })

  }));

  it("should create the component", () => {

    expect(component).toBeTruthy();

  });


  it("should display only beginner courses", () => {

    //we use the 'of' operator of rxjs to let know that the expected response is an Observable<Course[]>
    coursesService.findAllCourses.and.returnValue(of(beginnerCourses));
    //we let know the component that the data is passed and the component updated
    fixture.detectChanges();
    //we check our DOM element
    const tabs = el.queryAll(By.css('.mat-tab-label'));
    //console.log(tabs.length);
    expect(tabs.length).toBe(1, 'Unexpected number of tabs found');
  });


  it("should display only advanced courses", () => {

    //we use the 'of' operator of rxjs to let know that the expected response is an Observable<Course[]>
    coursesService.findAllCourses.and.returnValue(of(advancedCourses));
    //we let know the component that the data is passed and the component updated
    fixture.detectChanges();
    //we check our DOM element
    const tabs = el.queryAll(By.css('.mat-tab-label'));
    //console.log(tabs.length);
    expect(tabs.length).toBe(1, 'Unexpected number of tabs found');

  });


  it("should display both tabs", () => {

    //we use the 'of' operator of rxjs to let know that the expected response is an Observable<Course[]>
    coursesService.findAllCourses.and.returnValue(of(setupCourses()));
    //we let know the component that the data is passed and the component updated
    fixture.detectChanges();
    //we check our DOM element
    const tabs = el.queryAll(By.css('.mat-tab-label'));
    //console.log(tabs.length);
    expect(tabs.length).toBe(2, 'Expected to find 2 tabs found');

  });


  it("should display advanced courses when tab clicked", (done: DoneFn) => {

    //we use the 'of' operator of rxjs to let know that the expected response is an Observable<Course[]>
    coursesService.findAllCourses.and.returnValue(of(setupCourses()));
    //we let know the component that the data is passed and the component updated
    fixture.detectChanges();
    //we check our DOM element
    const tabs = el.queryAll(By.css('.mat-tab-label'));
    //Click on tab simulated
    //el.nativeElement.click();
    //we use the helper function click and passed the second tab as an argument
    click(tabs[1]);
    //console.log(tabs[1].nativeElement.textContent);
    //update on the component changes
    fixture.detectChanges();
    //Since the component is using an animiation that relies on window.requestAnimationFramte() we get an asynchronous operation, we use a setTimeout and the done parameter to indicate that after that time the assertions should be checked and by running done() we let know that the test is completed
    setTimeout(() => {
      const cardTitles = el.queryAll(By.css('.mat-tab-body-active .mat-card-title'));
      expect(cardTitles.length).toBeGreaterThan(0, 'Could not find card title');
      //console.log(cardTitles[0].nativeElement.textContent);
      expect(cardTitles[0].nativeElement.textContent).toContain('Angular Security Course');

      done();
    }, 500);
  });

});


