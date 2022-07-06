//creat array to save x, y
let coordinatesResult = [];
(function () {
    const chartTickerListDiv = document.getElementsByClassName('chart-ticker-list')[0];
    const chartTickerListCanvas = document.getElementsByClassName('chart-ticker-list-canvas')[0];
    const runOneYearSelectorText = document.getElementsByClassName('run-one-year-selector')[0];
    const runOneYearButton = document.getElementsByClassName('run-one-year-button')[0];
    let selectedYear = runOneYearSelectorText.value;
    const yearCurrent = document.getElementsByClassName('one-year-current')[0];
    const manyYearCurrent = document.getElementsByClassName('many-multiple-year')[0];
    runOneYearButton.addEventListener('click', () => {
        playOneYear();
    });
    const runOneYearPrevButton = document.getElementsByClassName('run-one-year-prev-button')[0];
    runOneYearPrevButton.addEventListener('click', () => {
        playOneYearPrev();
    });
    const runOneYearNextButton = document.getElementsByClassName('run-one-year-next-button')[0];
    runOneYearNextButton.addEventListener('click', () => {
        playOneYearNext();
    });
    // Init run multiple year panel
    const runMultipleYearSelectorStartText = document.getElementsByClassName('run-multiple-year-selector-start')[0];
    const runMultipleYearSelectorEndText = document.getElementsByClassName('run-multiple-year-selector-end')[0];
    const runMultipleYearButton = document.getElementsByClassName('run-multiple-year-button')[0];
    runMultipleYearButton.addEventListener('click', () => {
        playMultipleYear();
    });
    // Init data
    // const maxCapitalImgWidth = 1000;
    function createDiv(className, innerHTML) {
        let divElement = document.createElement('DIV');
        divElement.setAttribute('class', className);
        if (innerHTML) {
            divElement.innerHTML = innerHTML;
        }
        return divElement;
    }

    function createTickerItem(tickerData, index) {
        // Create ticker item div
        let tickerItemDiv = createDiv('chart-ticker-item');
        tickerItemDiv.setAttribute('name', tickerData.ticker);
        tickerItemDiv.setAttribute('id', tickerData.ticker);
        tickerItemDiv.style.width = tickerData.capitalItem + 'px';
        tickerItemDiv.style.height = tickerData.capitalItem + 'px';
        tickerItemDiv.style.background = tickerData.color;
        // Create ticker item name div
        let tickerItemNameDiv = createDiv('chart-ticker-item-name', tickerData.ticker);
        // Create ticker item capital text div
        let tickerItemCapitalTextDiv = createDiv('chart-ticker-item-capital-text', tickerData.capitalItem);
        // Construct ticker item div by append all children div
        tickerItemDiv.append(tickerItemNameDiv);
        tickerItemDiv.append(tickerItemCapitalTextDiv);
        return tickerItemDiv;
    }

    const maxCapitalImgWidth = 300;
    function calculateCapitalWidth(sortedTickerDataList) {
        const maxCapital = sortedTickerDataList[0].capital;
        for (let tickerData of sortedTickerDataList) {
            tickerData.capital = tickerData.capital / maxCapital * maxCapitalImgWidth;
        }
        return sortedTickerDataList;
    }
    function calculateCoordinates(j, tickerDataList, coordinatesResult) {
        circleRadius = tickerDataList[j].capital / 2;
        let a1, a2, b1, b2;
        if (j === 2) {
            a2 = tickerDataList[j - 1].capital / 2 + tickerDataList[j - 2].capital
            a1 = tickerDataList[j - 2].capital / 2;
            b2 = tickerDataList[j - 1].capital / 2;
            b1 = tickerDataList[j - 2].capital / 2;
        } else {
            for (let i = 3; i < coordinatesResult.length + 1; i++) {
                if (i % 2 !== 0) {
                    a1 = coordinatesResult[i - 2].x;
                    a2 = coordinatesResult[i - 1].x;
                    b1 = coordinatesResult[i - 2].y;
                    b2 = coordinatesResult[i - 1].y;
                } else if (i % 2 === 0) {
                    a1 = coordinatesResult[i - 2].x;
                    a2 = coordinatesResult[i - 1].x;
                    b1 = coordinatesResult[i - 2].y;
                    b2 = coordinatesResult[i - 1].y;
                }
            }
        }
        // (r1+r3)^2 - (r2+r3)^2 
        const E = Math.pow((tickerDataList[j - 2].capital / 2 + circleRadius), 2) - Math.pow((tickerDataList[j - 1].capital / 2 + circleRadius), 2);
        const D = E - (a1 * a1) + (a2 * a2) - (b1 * b1) + (b2 * b2);
        const C = Math.pow(D, 2) / (4 * Math.pow((a2 - a1), 2)) - ((D * a2) / (a2 - a1)) + Math.pow(a2, 2) + Math.pow(b2, 2) - Math.pow((tickerDataList[j - 1].capital / 2 + circleRadius), 2);
        const B = -(D * (b2 - b1)) / Math.pow((a2 - a1), 2) + ((2 * a2 * (b2 - b1)) / (a2 - a1)) - (2 * b2);
        const A = Math.pow((b2 - b1) / (a2 - a1), 2) + 1;
        const delta = B * B - (4 * A * C);
        graphVerticalAxis = (-B + Math.sqrt(delta)) / (2 * A); // y 
        graphHorizontalAxis = (D - (2 * (b2 - b1) * graphVerticalAxis)) / (2 * (a2 - a1)); // x
        return {
            r: circleRadius,
            y: graphVerticalAxis,
            x: graphHorizontalAxis
        }
    }
    

    function createTickerItemOfASpecificTime(tickerDataList) {
        // 1. Clear the chart ticker list
        chartTickerListDiv.innerHTML = '';
        chartTickerListCanvas.innerHTML = '';
        let chartTickerListCanvasText = chartTickerListCanvas.getContext("2d");
        // 2. Sort the data list
        tickerDataList.sort((item1, item2) => {
            return item1.capital > item2.capital ? -1 : item1.capital < item2.capital ? 1 : 0;
        });
        // 3. Calculate capital width
        tickerDataList = calculateCapitalWidth(tickerDataList);
        // 4. Create ticker item div and append to the chart-ticker-list div
        let diameterCirclePrev = 0;
        for (let j = 0; j < tickerDataList.length; j++) {
            let tickerData = tickerDataList[j];
            // toa do Ox cua tam hinh tron
            let graphHorizontalAxis;
            // toa do Oy cua tam hinh tron
            let graphVerticalAxis;
            // ban kinh
            let circleRadius;
            if (j === 0) {  
                circleRadius = tickerData.capital / 2
                graphHorizontalAxis = tickerData.capital / 2;
                graphVerticalAxis = tickerData.capital / 2;
            } else if (j === 1) {
                circleRadius = tickerData.capital / 2;
                diameterCirclePrev += tickerDataList[j - 1].capital;
                graphHorizontalAxis = diameterCirclePrev + circleRadius;
                graphVerticalAxis = tickerData.capital / 2;
            } else if (j === 2) {
                let coordinates = calculateCoordinates(j, tickerDataList, coordinatesResult);
                graphVerticalAxis = coordinates.y; // y 
                graphHorizontalAxis = coordinates.x; // x    
                circleRadius = coordinates.r;            
            } else {
                let coordinates = calculateCoordinates(j, tickerDataList, coordinatesResult);
                graphVerticalAxis = coordinates.y; // y 
                graphHorizontalAxis = coordinates.x; // x    
                circleRadius = coordinates.r;
            }
            coordinatesResult.push({
                x: graphHorizontalAxis,
                y: graphVerticalAxis
            })

            const tickerItemDiv = createTickerItem(tickerData, j);
            chartTickerListCanvasText.beginPath();
            // ve hinh tron 
            chartTickerListCanvasText.arc(graphHorizontalAxis, graphVerticalAxis, circleRadius, 0, Math.PI * 2, true);
            chartTickerListCanvasText.fillStyle = tickerData.color;
            chartTickerListCanvasText.fill();
            // hien thi canvas
            chartTickerListCanvasText.stroke();

            chartTickerListCanvas.append(tickerItemDiv);
            chartTickerListDiv.append(chartTickerListCanvas);
        }
        return coordinatesResult;

    }

    function playOneYear() {

        let selectedYear = runOneYearSelectorText.value;
        yearCurrent.innerHTML = 'Year current: ' + (+selectedYear);
        try {
            if (+selectedYear < 2000) throw "no data below 2000";
            if (+selectedYear > 2100) throw "no data below 2100";
        } catch (e) {
            alert(' ' + e);
        }
        playAYear(selectedYear);
    }
    function playAYear(year) {
        let specificYearTickerData = fakeData[year];
        if (specificYearTickerData) {
            createTickerItemOfASpecificTime(specificYearTickerData);
        }
    }
    function playOneYearPrev() {
        let selectedYear = runOneYearSelectorText.value;
        yearCurrent.innerHTML = 'Year current: ' + (+selectedYear - 1);
        try {
            if (+selectedYear < 2000) throw "no data below 2000";
            selectedYear = parseInt(selectedYear);
            runOneYearSelectorText.value = --selectedYear;
        } catch (e) {
            alert('' + e);
        }
        playAYear(selectedYear);
    }

    function playOneYearNext() {
        runMultipleYearSelectorStartText.innerHTML = '';
        let selectedYear = runOneYearSelectorText.value; // Year
        yearCurrent.innerHTML = 'Year current: ' + (+selectedYear + 1);
        try {
            if (+selectedYear > 2100) throw "no data below 2100";
            selectedYear = parseInt(selectedYear);
            runOneYearSelectorText.value = ++selectedYear; // todo: validate min and max year depend on vn30 data
        } catch (e) {
            alert('' + e);
        }
        playAYear(selectedYear);
    }
    function playMultipleYear() {
        try {
            let startYear = parseInt(runMultipleYearSelectorStartText.value);
            let endYear = parseInt(runMultipleYearSelectorEndText.value);
            manyYearCurrent.innerHTML = 'Capital chart of VN30 from ' + startYear + ' to ' + endYear;
            if (endYear < startYear || runMultipleYearSelectorStartText === ' ' || runMultipleYearSelectorEndText === ' ') {
                return;
            }
            runOneYearSelectorText.value = startYear;
            setInterval(() => {
                let selectedYear = parseInt(runOneYearSelectorText.value);
                if (selectedYear < endYear && selectedYear >= 2000 && endYear <= 2100) {
                    playOneYearNext(fakeData);
                }
            }, 1000);
        } catch (e) {
            console.log('invalid year');
        }
    }
    let fakeData = generateData(vn30Data, initialCapital, velocity, 2000, 2100);
    createTickerItemOfASpecificTime(fakeData['2000']);
})() 