'use strict'
let statusButtons = $('#statusContainer button')
let gridButtons = $('#gridButtonContainer button')
let timer = $('#timer')
let matched = $('#matchCount')
let interval = null
let status = null
let time = 0
let randomGridArray = []
let currentMatched = 0
let highScore = 0;
toggleDisable(gridButtons);
statusButtons.on('click', function () {
    if (status === 'start' || status === null) {
        initGrid(gridButtons)
        toggleDisable(gridButtons);
        return
    }
    toggleDisable(gridButtons);
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
        $(timer).html(time)
        return
    }
    time += 1
    $(timer).html(time)
}

//extras
function revealGrid (grid) {
    $(gridButtons).each(function (index) {
        let imageUrlPath = `url('./images/${randomGridArray[index]}.png')`
        $(this).css({ 'background-image': imageUrlPath })
    })
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
        $(this).css('background-image', 'url(./images/hide.png')
    })
    $(grid).off() //remove eventListener from grid
    currentMatched = 0
    updateMatch()
    switchStatus()
    clearInterval(interval) //clear update interval
    interval = null
    updateTimer()

}

function initGrid (grid) {
    let selection1, selection2
    switchStatus()
    interval = setInterval(updateTimer, 1000)
    randomGridArray = randomize(grid)
    $(grid).on('click', function (event) {
        let imageUrl = `url('./images/${randomGridArray[event.currentTarget.id - 1]}.png')`
        $(this).css({ 'background-image': imageUrl })
        if (!selection1) {
            selection1 = $(this)
            $(selection1).prop('disabled',true); //bug fix cannot select first element twice
            return
        }
        selection2 = $(this)
        selection1 = selection2 = matchHandler(selection1, selection2)
    })
}

function matchHandler (selection1, selection2) {
    if (checkMatch(selection1, selection2)) {
        currentMatched += 1
        updateMatch()
        return null
    }
    setTimeout(function () {
        toggleDisable(gridButtons)
        resetMatch(selection1, selection2)
    }, 1000)
    toggleDisable(gridButtons)
    return null
}

function checkMatch (selection1, selection2) {
    return ($(selection1).css('background-image') === $(selection2).css('background-image')) ? true : false
}

function resetMatch (selection1, selection2) {
    $(selection1).css('background-image', 'url(\'./images/hide.png\')')
    $(selection2).css('background-image', 'url(\'./images/hide.png\')')
}

function updateMatch (selection1, selection) {
    $(matched).html(currentMatched)
}

function toggleDisable (grid) {
    if ($(grid).prop('disabled')) {
        $(grid).prop('disabled', false)
        return
    }
    $(grid).prop('disabled', true)
}
