import ApiService from "../apiServices";


class ProgressService extends ApiService {

    constructor() {
        super('/api/progress')
    }

    getProgress(key){
        return this.get(`/getProgress/${key}`)
    }

    deleteProgress(key){
        return this.delete(`/deleteProgress/${key}`)
    }
}

export default ProgressService