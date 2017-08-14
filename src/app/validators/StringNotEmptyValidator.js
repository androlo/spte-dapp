// @flow
export default class StringNotEmptyValidator {
    static validate(str) {
        return str !== "";
    }
}