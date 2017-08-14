// @flow
class VersionAPI {
    _version: any;

    constructor(version: any) {
        this._version = version;
    }

    get api(): string {
        return (this._version.api: string);
    }

    async getNode(): Promise<string> {
        return new Promise((resolve, reject) => {
            this._version.getNode((err: Error, node: string) => {
                if (err) {
                    return reject(err);
                }
                return resolve(node);
            });
        });
    }
}

export default VersionAPI