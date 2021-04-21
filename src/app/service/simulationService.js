import ApiService from "../apiServices"

class SimulationService extends ApiService{

    constructor() {
        super('/api/simulation')
    }

    static minNodeIndexes(numberOfNodes){
        var indexList = [{label: null, value: null}]
        for (var i = 1; i <= numberOfNodes; i++) {
            indexList.push({label: i, value: i})
        }
       return indexList
    }
    static maxNodeIndexes(numberOfNodes, minNodeIndex){
        var indexList = [{label: null, value: null}]
        for (var i = minNodeIndex !==null ? minNodeIndex : 1; i <= numberOfNodes; i++) {
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
            console.log(instant, node1, node2)
            responseMessage += 'Instant: ' + instant + '\n' + '( ' + node1 + ', ' + node2 + ' )' + '\n' + '\n'
        })
        return responseMessage
    }

    generateMeetingTrace(simulationData){
        return this.post('/generateMeetingTrace', simulationData)
    }


}

export default SimulationService