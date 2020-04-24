import Logger from '../src/index';

// 初始化日志服务器
const logger = new Logger('HumanLog');

// 插件机制 针对inspect
logger.applyMiddlewares([
  {
    before: ({classname, methodname, logger}, ...args) => {
      logger.record(`${classname}.${methodname} is going to be called with: `, ...args);
    },
    after: ({classname, methodname, logger}, result) => {
      logger.record(`${classname}.${methodname} get result `, result);
    },
  }
])


class Human {
  private name: string;
  constructor(name: string) {
    this.name = name;
  }

  // 监控方法 默认level
  @logger.inspect('sayHi')
  sayHi(name: string) {
    return `Hi, ${name}, my name is${this.name}`
  }

  // 监控方法 debug
  @logger.inspect('laugh', 'debug')
  laugh() {
    return `${this.name} is laughing`
  }

  // 监控方法 warn
  @logger.inspect('sick', 'warn')
  sick() {
    return `${this.name} is sick`
  }

  // 监控方法 error
  @logger.inspect('danger', 'error')
  danger() {
    return `${this.name} is in dangeer`
  }
}

const wander = new Human('wander');

wander.sayHi('Bob');
wander.laugh();
wander.sick();
wander.danger();

logger.record('Ok Ts code is finished')


