import ApiService from "../apiServices"

class SimulationService extends ApiService{

    constructor() {
        super('/api/simulation')
    }

    download(key){
        return this.get(`/download?key=${ key }`, {responseType: 'arraybuffer'})
    }

    runSimulation(simulationData){
        return this.post('/runSimulation', simulationData)
    }

    getProgress(simulationProgressKey){
        let params = `?`
        params = `${params}&key=${simulationProgressKey}`
        return this.get(`/getSimulationProgress${params}`)
    }

    getSimulationReport(simulationProgressKey){
        let params = `?`
        params = `${params}&key=${simulationProgressKey}`
        return this.get(`/getSimulationReport${params}`)
    }

    static minNodeIndexes(numberOfNodes){
        var indexList = [{label: null, value: null}]
        for (var i = 0; i < numberOfNodes; i++) {
            indexList.push({label: i, value: i})
        }
       return indexList
    }
    static maxNodeIndexes(numberOfNodes, minNodeIndex){
        var indexList = [{label: null, value: null}]
        for (var i = minNodeIndex !==null ? minNodeIndex : 0; i < numberOfNodes; i++) {
            indexList.push({label: i, value: i})
        }
       return indexList
    }

    parseMeetingTrace(meetingTrace){
        var responseMessage = ''
        meetingTrace.meetingTrace.forEach(meet => {
            const instant = meet.instant
            const node1 = meet.pair.node1
            const node2 = meet.pair.node2
            responseMessage += 'Instant: ' + instant + '\n' + '( ' + node1 + ', ' + node2 + ' )' + '\n' + '\n'
        })
        return responseMessage
    }

    parseMessages(messages){
        var responseMessage = ''
        messages.forEach(message => {
                responseMessage += JSON.stringify(message)
                responseMessage += '\n\n'
            }
            )
        return responseMessage
    }

    base64ToArrayBuffer(base64) {
        var binaryString = window.atob(base64);
        var binaryLen = binaryString.length;
        var bytes = new Uint8Array(binaryLen);
        for (var i = 0; i < binaryLen; i++) {
           var ascii = binaryString.charCodeAt(i);
           bytes[i] = ascii;
        }
        return bytes;
    }

}

export default SimulationService