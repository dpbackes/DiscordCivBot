let handlers = [];

function addHandler(pattern, func) {
    handlers.push(message => {
        let matches;
        if ((matches = pattern.exec(message)) !== null) {
            func(message, matches)
            return true
        }
    })
}

function handle(message) {
    let handled = false
    handlers.forEach(handler => handled = handler(message) || handled)
    return handled
}

module.exports = {
    addHandler,
    handle
}