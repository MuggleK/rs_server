const log4js = require('log4js')
const Path = require('path')

const levels = {
    'trace': log4js.levels.TRACE,
    'debug': log4js.levels.DEBUG,
    'info': log4js.levels.INFO,
    'warn': log4js.levels.WARN,
    'error': log4js.levels.ERROR,
    'fatal': log4js.levels.FATAL,
}

log4js.configure({
    replaceConsole: true,
    appenders: {
        stdout: {
            type: 'console'
        },
        cheese: {
            type: 'dateFile',
            filename: Path.resolve(__dirname, `../logs/info`),
            encoding: 'utf-8',
            pattern: "yyyy-MM-dd.log",
            alwaysIncludePattern: true,
        }
    },
    categories: {
        default: {appenders: ['stdout', 'cheese'], level: 'debug'},
    }
})

exports.logger = (name, level) => {
    const logger = log4js.getLogger(name)
    logger.level = levels[level] || levels['debug']
    return logger
}