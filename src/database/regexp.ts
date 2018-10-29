export default class RegExp {
    regexp: string
    options: string
    constructor({ regexp, options }) {
        if (!regexp) {
            throw new TypeError('regexp must be a string')
        }
        this.regexp = regexp
        this.options = options
    }
}