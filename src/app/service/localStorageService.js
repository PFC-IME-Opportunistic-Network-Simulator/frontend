class LocalStorageService {

    static addItem(key, value){
        localStorage.setItem(key, JSON.stringify(value))
    }

    static getItem(key){
        return JSON.parse(localStorage.getItem(key))
    }

    static removeItem(key){
        localStorage.removeItem(key)
    }

}

export default LocalStorageService