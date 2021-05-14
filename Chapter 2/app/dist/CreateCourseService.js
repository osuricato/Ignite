"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CreateCourseService = /** @class */ (function () {
    function CreateCourseService() {
    }
    CreateCourseService.prototype.execute = function (_a) {
        var duration = _a.duration, educator = _a.educator, name = _a.name;
        console.log(duration, educator, name);
    };
    return CreateCourseService;
}());
exports.default = new CreateCourseService();
