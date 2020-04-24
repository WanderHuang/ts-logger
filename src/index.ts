import chalk from 'chalk';

type LoggerType = {
  record: (...params: any[]) => void;
};

type LevelType = "error" | "warn" | "info" | "debug";

type PluginApi = {
  classname: string;
  methodname: string;
  logger: LoggerType;
};

type PluginTypeBefore = (api: PluginApi, ...params: any[]) => void;
type PluginTypeAfter = (api: PluginApi, result: any, ...params: any[]) => void;

type PluginType = {
  before?: PluginTypeBefore;
  after?: PluginTypeAfter;
};

class Logger {
  private modulename: string = 'Logger';
  private level: LevelType = 'info';
  private befores: PluginTypeBefore[] = [];
  private afters: PluginTypeAfter[] = [];
  private levelColorMap = {
    error: "red",
    warn: "yellow",
    info: "white",
    debug: "cyan",
  };

  // 开放接口
  public debug: LoggerType;
  public info: LoggerType;
  public error: LoggerType;
  public warn: LoggerType;

  constructor(modulename?: string, level?: LevelType)  {
    if (modulename) {
      this.modulename = modulename;
    }
    if (level) {
      this.level = level
    }

    this.debug = this;
    this.info = this;
    this.error = this;
    this.warn = this;

    return new Proxy(this, {
      get(instance, prop: string | LevelType) {
        if (Object.keys(instance.levelColorMap).includes(prop)) {
          instance.level = prop as LevelType;
          return instance;
        } else {
          return instance[prop]
        }
      },
    });
  }

  private decorate(level: LevelType, ...params: string[]) {
    const color = this.levelColorMap[level];

    console.log(chalk[color](`[${level}] [${this.modulename}]`), ...params);
  }

  /**
   * 插件机制
   * @param plugins 插件集合
   */
  public applyMiddlewares(plugins: PluginType[]) {
    this.befores = plugins.filter((fn) => fn.before).map((fn) => fn.before);
    this.afters = plugins.filter((fn) => fn.after).map((fn) => fn.after);
  }

  /**
   * 打印日志
   * @param params 
   */
  record(...params: any[]) {
    this.decorate(this.level, ...params);
  }

  /** 装饰器 */
  inspect(modulename: string, level?: LevelType) {
    this.modulename = modulename;
    const logger = new Logger(modulename, level || this.level)

    console.log(level ,logger.level)
    const $this = this;
    return function (
      target: any,
      propertyKey: string,
      descriptor: PropertyDescriptor
    ) {
      const originalMethod = descriptor.value;
      descriptor.value = function proxyMethod(...args: any[]) {
        const api = {
          classname: target.constructor.name,
          methodname: propertyKey,
          logger,
        };
        $this.befores.forEach((fn) => fn(api, ...args));
        const realResult = originalMethod.apply(this, args);
        $this.afters.forEach((fn) => fn(api, realResult, ...args));
        return realResult;
      };
    };
  }
}


export default Logger;