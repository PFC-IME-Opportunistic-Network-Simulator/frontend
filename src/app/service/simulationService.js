class SimulationService {

    static minNode1Indexes(numberOfNodes){
        var indexList = [{label: null, value: null}]
        for (var i = 1; i <= numberOfNodes; i++) {
            indexList.push({label: i, value: i})
        }
       return indexList
    }
    static maxNode1Indexes(numberOfNodes, minNode1Index){
        var indexList = [{label: null, value: null}]
        for (var i = minNode1Index !==null ? minNode1Index : 1; i <= numberOfNodes; i++) {
            indexList.push({label: i, value: i})
        }
       return indexList
    }

}

export default SimulationService