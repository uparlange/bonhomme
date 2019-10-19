class BaseClass {

    constructor() {

    }

    getLogger() {
        const that = this;
        return {
            debug(message) {
                this._log("log", message);
            },
            info(message) {
                this._log("info", message);
            },
            _log(methodName, message) {
                console[methodName]("[" + that.constructor.name + "] " + message);
            }
        }
    }
}

export default BaseClass;