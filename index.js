(function() {
    // Init const elements
    // Init run one year panel
    const chartTickerListDiv = document.getElementsByClassName('chart-ticker-list')[0];
    const runOneYearSelectorText = document.getElementsByClassName('run-one-year-selector')[0];
    const runOneYearButton = document.getElementsByClassName('run-one-year-button')[0];
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
    let defaultCapitalImgOffer = 150;
    const maxCapitalImgWidth = 1000;
    

    function createDiv(className, innerHTML) {
        let divElement = document.createElement('DIV');
        divElement.setAttribute('class', className);
        if (innerHTML) {
            divElement.innerHTML = innerHTML;
        }
        return divElement;
    }

    function createTickerItem(tickerData) {
        // Create ticker item div
        let tickerItemDiv = createDiv('chart-ticker-item');

        // Create ticker item name div
        let tickerItemNameDiv = createDiv('chart-ticker-item-name', tickerData.ticker);

        // Create ticker item capital img div
        let tickerItemCapitalImgDiv = createDiv('chart-ticker-item-capital-img');
        tickerItemCapitalImgDiv.style.setProperty('width', tickerData.capitalImgWidth + 'px');

        // Create ticker item capital text div
        let tickerItemCapitalTextDiv = createDiv('chart-ticker-item-capital-text', tickerData.capital);

        // Construct ticker item div by append all children div
        tickerItemDiv.append(tickerItemNameDiv);
        tickerItemDiv.append(tickerItemCapitalImgDiv);
        tickerItemDiv.append(tickerItemCapitalTextDiv);
        return tickerItemDiv;
    }

    function calculateCapitalWidth(sortedTickerDataList) {
        const maxCapital = sortedTickerDataList[0].capital;
        for(let tickerData of sortedTickerDataList) {
            tickerData.capitalImgWidth = tickerData.capital / maxCapital * maxCapitalImgWidth;
        }
        return sortedTickerDataList;
    }

    function createTickerItemOfASpecificTime(tickerDataList) {
        // 1. Clear the chart ticker list
        chartTickerListDiv.innerHTML = '';
        // 2. Sort the data list
        tickerDataList.sort((item1, item2) => {
            return item1.capital > item2.capital ? -1 : item1.capital < item2.capital? 1 : 0;
        });
        // 3. Calculate capital width
        tickerDataList = calculateCapitalWidth(tickerDataList);
        // 4. Create ticker item div and append to the chart-ticker-list div
        for(const tickerData of tickerDataList) {
            const tickerItemDiv = createTickerItem(tickerData)
            chartTickerListDiv.append(tickerItemDiv);
        }
    }

    function playAYear(year) {
        let specificYearTickerData = vn30Data[year];
        if(specificYearTickerData) {
            createTickerItemOfASpecificTime(specificYearTickerData);
        }
    }

    function playOneYear() {
        let selectedYear = runOneYearSelectorText.value;
        playAYear(selectedYear);
    }

    function playOneYearPrev() {
        let selectedYear = runOneYearSelectorText.value;
        try {
            selectedYear = parseInt(selectedYear);
            runOneYearSelectorText.value = --selectedYear;
        } catch(e) {
            selectedYear = 0;
        }
        playAYear(selectedYear);
    }

    function playOneYearNext() {
        let selectedYear = runOneYearSelectorText.value;
        try {
            selectedYear = parseInt(selectedYear);
            runOneYearSelectorText.value = ++selectedYear; // todo: validate min and max year depend on vn30 data
        } catch(e) {
            selectedYear = 0;
        }
        playAYear(selectedYear);
    }

    function playMultipleYear() {
        try {
            let startYear = parseInt(runMultipleYearSelectorStartText.value);
            let endYear = parseInt(runMultipleYearSelectorEndText.value);
            if(endYear < startYear) {
                return;
            }
            runOneYearSelectorText.value = startYear;
            setInterval(() => {
                let selectedYear = parseInt(runOneYearSelectorText.value);
                if(selectedYear < endYear) {
                    playOneYearNext();
                }
            }, 1000);
        } catch(e) {
            console.log('invalid year');
        }
    }

    createTickerItemOfASpecificTime(vn30Data['2000']);
})()
