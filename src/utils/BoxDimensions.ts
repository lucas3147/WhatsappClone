export function delimitChildBoxDimensions(
    maximumSize: {width : number, height : number},
    currentSize : {width : number, height : number}
) 
{
    const cartonRatio = currentSize.width / currentSize.height;

    if (currentSize.width / maximumSize.width > currentSize.height / maximumSize.height) {
        currentSize.width = maximumSize.width;
        currentSize.height = currentSize.width / cartonRatio;
    } else {
        currentSize.height = maximumSize.height;
        currentSize.width = currentSize.height * cartonRatio;
    }

    return currentSize;
}