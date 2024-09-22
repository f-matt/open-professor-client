import { Answer } from "./answer.model";
import { Course } from "./course";

export class Question {

    id?: any;
    text?: any;
    section?: number;
    course? : Course;
    answers? : Answer[];

}
