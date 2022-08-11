import { TestBed } from "@angular/core/testing";
import { CoursesService } from "./courses.service";
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { COURSES, findLessonsForCourse } from "../../../../server/db-data";
import { Course } from "../model/course";
import { HttpErrorResponse } from "@angular/common/http";

describe('CoursesService', () => {

  let coursesService: CoursesService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {

      TestBed.configureTestingModule({
        //Imports an HttpClient mock dependency directly from angular
        imports: [HttpClientTestingModule],
        providers: [
          CoursesService,
        ]
      });
      //mock injection of our service to access its methods
      coursesService = TestBed.inject(CoursesService);
      httpTestingController = TestBed.inject(HttpTestingController);
    });

  it('should retrieve all courses', () => {
    //Since the original method return an observable we need to subscribe
    coursesService.findAllCourses()
      .subscribe(courses => {
        expect(courses).toBeTruthy('No courses returned');
        expect(courses.length).toBe(12, 'incorrect number of courses');

        const course = courses.find(course => course.id === 12);

        expect(course.titles.description).toBe('Angular Testing Course');
      });

      //To test our http request we should expect that only one method was called and the url hitting it will be the one actually used by the real method (mock http request)
      const req = httpTestingController.expectOne('/api/courses');

      //Testing our http request we should expect that only one method was called and to be GET
      expect(req.request.method).toBe('GET');

      //flush resolves the request by returning a body plus additional HTTP information (such as response headers) if provided. If the request specifies an expected body type, the body is converted into the requested type. Otherwise, the body is converted to JSON by default.

      //we should match the same structure from the original request
      req.flush({
        payload:
          //We return an array of courses imported from db-data and assign it to the payload property
          Object.values(COURSES)
      });
  });

  it('should find a coursse by id', () => {
    const id = 12;
    coursesService.findCourseById(id)
      .subscribe(course => {

        expect(course).toBeTruthy('No course found');
        expect(course.id).toBe(id);
      });
      const req = httpTestingController.expectOne(`/api/courses/${id}`);
      expect(req.request.method).toEqual('GET');

      //console.log(COURSES[id]);
      req.flush(COURSES[id]);
  });

  it('should save the course data', () => {

    const id = 12;

    const changes: Partial<Course> = {
      titles: {
        description: 'Testing course'
      }
    }

    coursesService.saveCourse(id, changes).subscribe(course => {
      //we check that we change the same course which Id we passed on
      expect(course.id).toBe(id);
    });
    const req = httpTestingController.expectOne(`/api/courses/${id}`);
    expect(req.request.method).toEqual('PUT');

    expect(req.request.body.titles.description).toEqual(changes.titles.description);

    //to match the mock request with original data, we use the spread operator to get the original object and we uset again to change only the required data to match
    req.flush({
      ...COURSES[id],
      ...changes
    });
  });

  it('should give an error if save course fails', () => {

    const id = 12;

    const changes: Partial<Course> = {
      titles: {
        description: 'Testing course'
      }
    }

    coursesService.saveCourse(id, changes)
      .subscribe(
        //We make sure that the test fails and return we set up the error we're looking for
        () => fail('the save course operation should have failed'),
        (error: HttpErrorResponse) => {
          expect(error.status).toBe(500);
        }
      );

    const req = httpTestingController.expectOne(`/api/courses/${id}`);

    expect(req.request.method).toEqual('PUT');

    //The text could be anything but the second argument must match the status added inside the subscription
    req.flush('save course failed', { status: 500, statusText: 'Internal Server Error' });
  });

  afterEach(() => {
    //Verify that no other request are made.
    httpTestingController.verify()
  });

  it('should find a list of lessons', () => {
    const id = 12;

    coursesService.findLessons(id)
      .subscribe(lessons => {
        expect(lessons).toBeTruthy();
        expect(lessons.length).toBe(3);
      });

      //since we have multiple url params we can just match the url
      const req = httpTestingController.expectOne(req => req.url == '/api/lessons');

      expect(req.request.method).toEqual('GET');
      //every param must be type string
      expect(req.request.params.get('courseId')).toBe('12');
      expect(req.request.params.get('filter')).toBe('');
      expect(req.request.params.get('sortOrder')).toBe('asc');
      expect(req.request.params.get('pageNumber')).toBe('0');
      expect(req.request.params.get('pageSize')).toBe('3');

      //we use the helper function findLessonsForCourse and pass the lesson id and slice the first 3 elements to match the pageSize param
      req.flush({
        payload: findLessonsForCourse(12).slice(0,3)
      })
  });



});
