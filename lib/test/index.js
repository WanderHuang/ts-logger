"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = __importDefault(require("../src/index"));
var logger = new index_1.default('HumanLog');
logger.applyMiddlewares([
    {
        before: function (_a) {
            var classname = _a.classname, methodname = _a.methodname, logger = _a.logger;
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            logger.record.apply(logger, __spreadArrays([classname + "." + methodname + " is going to be called with: "], args));
        },
        after: function (_a, result) {
            var classname = _a.classname, methodname = _a.methodname, logger = _a.logger;
            logger.record(classname + "." + methodname + " get result ", result);
        },
    }
]);
var Human = /** @class */ (function () {
    function Human(name) {
        this.name = name;
    }
    Human.prototype.sayHi = function (name) {
        return "Hi, " + name + ", my name is" + this.name;
    };
    Human.prototype.laugh = function () {
        return this.name + " is laughing";
    };
    Human.prototype.sick = function () {
        return this.name + " is sick";
    };
    Human.prototype.danger = function () {
        return this.name + " is in dangeer";
    };
    __decorate([
        logger.inspect('sayHi')
    ], Human.prototype, "sayHi", null);
    __decorate([
        logger.inspect('laugh', 'debug')
    ], Human.prototype, "laugh", null);
    __decorate([
        logger.inspect('sick', 'warn')
    ], Human.prototype, "sick", null);
    __decorate([
        logger.inspect('danger', 'error')
    ], Human.prototype, "danger", null);
    return Human;
}());
var wander = new Human('wander');
wander.sayHi('Bob');
wander.laugh();
wander.sick();
wander.danger();
logger.record('Ok Ts code is finished');
