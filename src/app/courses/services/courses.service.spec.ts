import { TestBed } from "@angular/core/testing";
import { CoursesService } from "./courses.service";
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { COURSES } from "../../../../server/db-data";

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

      //To test our http request we should expect that only one method was called and the url hitting it will be the one actually used by the real method
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

});
