import {async, ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {CoursesCardListComponent} from './courses-card-list.component';
import {CoursesModule} from '../courses.module';
import {COURSES} from '../../../../server/db-data';
import {DebugElement} from '@angular/core';
import {By} from '@angular/platform-browser';
import {sortCoursesBySeqNo} from '../home/sort-course-by-seq';
import {Course} from '../model/course';
import {setupCourses} from '../common/setup-test-data';


describe('CoursesCardListComponent', () => {

  //The component we're gonna test
  let component: CoursesCardListComponent;
  //A declaration of an instace of the component to be test that allows us the debuggin process
  let fixture: ComponentFixture<CoursesCardListComponent>;
  //A debug element which allows us to query the DOM
  let el: DebugElement;

  //we could use async in the beforeEach block to wait for the component creation but since it's deprecated we use waitForAsync
  beforeEach(waitForAsync(() => {

    TestBed.configureTestingModule({
      //Since this is a presentation component we could use the declarations property and declare every single dependencies for creating this testing module but instead we can just import a real angular module with the real component dependencies.
      imports: [CoursesModule]
    })
      //We compile our component and after that we setup the configurationf of our tests
      .compileComponents()
      .then(() => {
        //saving the component fixture before each test, passing the component we want to create
        fixture = TestBed.createComponent(CoursesCardListComponent);
        //we use ficture to create an instance of the component itself
        component = fixture.componentInstance;
        el = fixture.debugElement;
      });
  }));


  it("should create the component", () => {

   expect(component).toBeTruthy();

  });


  it("should display the course list", () => {

    //we pass some data to the courses by using the setupCourses() method which returns an array of COURSES from the db-data file
    component.courses = setupCourses();
    //we let the component know that we added some data
    fixture.detectChanges();
    //console.log(el.nativeElement.outerHTML);
    //just like a regular querySelector
    const cards = el.queryAll(By.css('.course-card'));
    expect(cards).toBeTruthy('Could not find cards');
    //console.log(cards);
    expect(cards.length).toBe(12,'Unexpected number of courses');

  });


  it("should display the first course", () => {

    component.courses = setupCourses();
    fixture.detectChanges();

    const course = component.courses[0];
    const card = el.query(By.css('.course-card:first-child'));
    const title = card.query(By.css('.mat-card-title'));
    const image = card.query(By.css('.mat-card-image'));

    //we check that the card exists
    expect(card).toBeTruthy('Could not find card');
    //the title matches with the courses from db-data
    expect(title.nativeElement.textContent).toBe(course.titles.description);
    //and finally the image
    expect(image.nativeElement.src).toBe(course.iconUrl);

  });


});


