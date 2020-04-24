"use strict";
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
var chalk_1 = __importDefault(require("chalk"));
var Logger = /** @class */ (function () {
    function Logger(modulename, level) {
        this.modulename = 'Logger';
        this.level = 'info';
        this.befores = [];
        this.afters = [];
        this.levelColorMap = {
            error: "red",
            warn: "yellow",
            info: "white",
            debug: "cyan",
        };
        if (modulename) {
            this.modulename = modulename;
        }
        if (level) {
            this.level = level;
        }
        this.debug = this;
        this.info = this;
        this.error = this;
        this.warn = this;
        return new Proxy(this, {
            get: function (instance, prop) {
                if (Object.keys(instance.levelColorMap).includes(prop)) {
                    instance.level = prop;
                    return instance;
                }
                else {
                    return instance[prop];
                }
            },
        });
    }
    Logger.prototype.decorate = function (level) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        var color = this.levelColorMap[level];
        console.log.apply(console, __spreadArrays([chalk_1.default[color]("[" + level + "] [" + this.modulename + "]")], params));
    };
    /**
     * 插件机制
     * @param plugins 插件集合
     */
    Logger.prototype.applyMiddlewares = function (plugins) {
        this.befores = plugins.filter(function (fn) { return fn.before; }).map(function (fn) { return fn.before; });
        this.afters = plugins.filter(function (fn) { return fn.after; }).map(function (fn) { return fn.after; });
    };
    /**
     * 打印日志
     * @param params
     */
    Logger.prototype.record = function () {
        var params = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            params[_i] = arguments[_i];
        }
        this.decorate.apply(this, __spreadArrays([this.level], params));
    };
    /** 装饰器 */
    Logger.prototype.inspect = function (modulename, level) {
        this.modulename = modulename;
        // const logger: Logger = this[level || this.level] as Logger;
        var logger = new Logger(modulename, level || this.level);
        console.log(level, logger.level);
        var $this = this;
        return function (target, propertyKey, descriptor) {
            var originalMethod = descriptor.value;
            descriptor.value = function proxyMethod() {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                var api = {
                    classname: target.constructor.name,
                    methodname: propertyKey,
                    logger: logger,
                };
                $this.befores.forEach(function (fn) { return fn.apply(void 0, __spreadArrays([api], args)); });
                var realResult = originalMethod.apply(this, args);
                $this.afters.forEach(function (fn) { return fn.apply(void 0, __spreadArrays([api, realResult], args)); });
                return realResult;
            };
        };
    };
    return Logger;
}());
exports.default = Logger;
