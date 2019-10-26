const outputs = [];
const k = 3;

function onScoreUpdate(dropPosition, bounciness, size, bucketLabel) {
    outputs.push([dropPosition, bounciness, size, bucketLabel]);
}

// Gauges overall accuracy of algorithm
function runAnalysis() {
    const testSetCount = 10
    // Create predictions for 10 random sets of data
    const [testSet, trainingSet] = splitDataset(outputs, testSetCount)

    const accuracy = _.chain(testSet)
        .filter(testObservation => knn(trainingSet, testObservation[0]) === testObservation[3])
        .size()
        .divide(testSetCount)
        .value()

    console.log('Accuracy: ', accuracy);
}

// Helper function
function knn(data, point) {
    return _.chain(data)
        .map( row => [distance(row[0], point), row[3]] )
        .sortBy( row => row[0] )
        .slice(0, k)
        .countBy( row => row[1] )
        .toPairs()
        .sortBy( row => row[1] )
        .last()
        .first()
        .parseInt()
        .value();
}

function distance(pointA, pointB) {
	return Math.abs(pointA - pointB)
}

// Differentiates training vs. test data
function splitDataset(data, testCount) {
    const shuffled = _.shuffle(data);

    const testSet = _.slice(shuffled, 0, testCount);
    const trainingSet = _.slice(shuffled, testCount)

    return [testSet, trainingSet];
}
