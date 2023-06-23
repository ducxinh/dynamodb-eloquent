declare class ModelNotFoundException {
    model: any;
    name: string;
    ids?: any[];
    message: string;
    code: number;
    statusCode: number;
    constructor(props: {
        model: string;
        ids?: any;
    });
}
export default ModelNotFoundException;
