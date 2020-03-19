'use strict'
let statusButtons = $('#statusContainer button')
let gridButtons = $('#gridButtonContainer button')
let timer = $('#timer')
let matched = $('#matchCount')
let highScore = $('#highScore')
let interval = null
let status = null
let time = 0
let randomGridArray = []
let currentMatched = 0
let highScoreTime = 0;
statusButtons.on('click', function () {
    if (status === 'start' || status === null) {
        initGrid(gridButtons)
        return
    }
    resetGrid(gridButtons)
})

function switchStatus () {
    statusButtons.each(function (index) {
        if ($(this).attr('class').includes('hide')) {
            $(this).removeClass('hide')
            status = 'reset'
        } else {
            $(this).addClass('hide')
            status = 'start'
        }
    })
}

function updateTimer () {
    if (!interval) {           //reset the time value
        time = 0
        $(timer).html(time+'s')
        return
    }
    time += 1
    $(timer).html(time+'s')
}


function randomize (grid) {
    let newGrid1 = []
    let newGrid2 = []

    while (newGrid1.length < 6 || newGrid2.length < 6) {
        let randomNum = Math.floor(Math.random() * 6 + 1)
        if (!newGrid1.includes(randomNum) && newGrid1.length < grid.length / 2) {
            newGrid1.push(randomNum)
        }
        randomNum = Math.floor(Math.random() * 6 + 1)
        if (!newGrid2.includes(randomNum) && newGrid2.length < grid.length / 2) {
            newGrid2.push(randomNum)
        }
    }
    return newGrid2.concat(newGrid2)
}

function resetGrid (grid) {
    $(grid).each(function () {
        $(this).css('background-image', `url('./images/hide.png')`)
        console.log($(this).css('background-image'))
    })
    $(grid).off() //remove eventListener from grid
    updateHighScore();
    currentMatched = 0
    updateMatch()
    switchStatus()
    clearInterval(interval) //clear update interval
    interval = null
    updateTimer()
    disableElement(grid);
}

function initGrid (grid) {
    enableElement(grid)
    let selection1, selection2
    switchStatus()
    interval = setInterval(updateTimer, 1000)
    randomGridArray = randomize(grid)
    $(grid).on('click', function (event) {
        let imageUrl = `url('./images/${randomGridArray[event.currentTarget.id - 1]}.png')`
        console.log(imageUrl);
        $(this).css({ 'background-image': imageUrl })
        console.log($(this).attr('style'))
        if(!selection1){
            selection1 = this;
            disableElement(selection1);
            return;
        }
        selection2= this;
        selection1 = selection2 = matchHandler(selection1, selection2)
    })
}

function matchHandler (selection1, selection2) {
    disableElement(gridButtons)
    console.log(checkMatch(selection1,selection2));
    if (checkMatch(selection1, selection2)) {
        currentMatched += 1
        $(selection1).off();
        $(selection2).off();
        updateMatch()
        enableElement(gridButtons);
        return null
    }
    setTimeout(function () {
        resetMatch(selection1, selection2)
        enableElement(gridButtons);
    }, 650)
    return null
}

function checkMatch (selection1, selection2) {
    return $(selection1).attr('style') === $(selection2).attr('style')
}

function resetMatch (selection1, selection2) {
    $(selection1).css('background-image', 'url(\'./images/hide.png\')')
    $(selection2).css('background-image', 'url(\'./images/hide.png\')')
}

function updateMatch (selection1, selection) {
    if(currentMatched === 6){
        resetGrid(gridButtons);
        return;
    }
    $(matched).html(currentMatched)
}

function disableElement (element) {
        $(element).prop('disabled', true)
}

function enableElement (element) {
    $(element).prop('disabled', false)
}

function updateHighScore(){
    time = parseInt($(timer).html())
    if(highScoreTime < time){
        highScoreTime = time
        $(highScore).html(highScoreTime+'s')
    }
}
