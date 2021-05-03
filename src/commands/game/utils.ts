// [0-max)
function randZeroToMax(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

// [min, max)
function randMinToMax(min, max) {
    return Math.floor(Math.random() * Math.floor(max - min)) + min;
}
