"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ModelNotFoundException {
    constructor(props) {
        const { model, ids } = props;
        this.code = 404;
        this.statusCode = 404;
        this.model = model;
        this.name = "ModelNotFoundException";
        this.ids = ids;
        this.message = `No query results for model [${model}]`;
        if (this.ids && Array.isArray(this.ids) && this.ids.length) {
            this.message = `${this.message} ${this.ids.join(", ")}`;
        }
    }
}
exports.default = ModelNotFoundException;
//# sourceMappingURL=modelNotFound.exception.js.map