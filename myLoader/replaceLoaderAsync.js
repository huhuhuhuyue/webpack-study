module.exports = function (source) {
    const res = source.replace('webpack', this.query.name)
    const callback = this.async()
    setTimeout(() => {
        callback(null, res)
    }, 1000);
}