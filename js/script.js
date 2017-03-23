$(document).ready(function () {
    'use strict';
    var clicked;
    var gameArr = [0, 0, 0, 0, 0, 0, 0, 0, 0]; //game matrix
    var indexOfClick;
    var win = false;
    var winner;
    var winScenario = [];
    var flag;
    var flag1;
    var tempArr = [];
    var dl = 'easy';

    //Add click listener to all fields
    $('.field').on('click', play);
    //Add click listener and set dificulty level
    $('.df').on('click',
        function () {
            if ($(this).attr('id') === 'easy') {
                dl = 'easy';
                $(this).addClass('active');
                $('#medium').removeClass('active');
                $('#hard').removeClass('active');
            }

            if ($(this).attr('id') === 'medium') {
                dl = 'medium';
                $(this).addClass('active');
                $('#easy').removeClass('active');
                $('#hard').removeClass('active');
            }

            if ($(this).attr('id') === 'hard') {
                dl = 'hard';
                $(this).addClass('active');
                $('#easy').removeClass('active');
                $('#medium').removeClass('active');
            }
        });

    //By clicking 'O' or 'X' player begins or resets the game
    //Regardles player's choice 'X' always starts the game
    $('#o').on('click', function () {
        clearBoard();
        $(this).addClass('active');
        $('#x').removeClass('active');
        if ((gameArr.indexOf('X') === -1 && gameArr.indexOf('O') === -1)) {
            clicked = 'O';
            play();
        } else {
            return;
        }
    });

    $('#x').on('click', function () {
        clearBoard();
        $(this).addClass('active');
        $('#o').removeClass('active');
        if ((gameArr.indexOf('X') === -1 && gameArr.indexOf('O') === -1)) {
            clicked = 'X';
            play();
        } else {
            return;
        }
    });
    // Changes index position value to id
    function indexToId(num) {
        var fieldId;
        if (num === 0) {
            fieldId = 'top-left';
        } else if (num === 1) {
            fieldId = 'top-mid';
        } else if (num === 2) {
            fieldId = 'top-right';
        } else if (num === 3) {
            fieldId = 'mid-left';
        } else if (num === 4) {
            fieldId = 'mid-mid';
        } else if (num === 5) {
            fieldId = 'mid-right';
        } else if (num === 6) {
            fieldId = 'bott-left';
        } else if (num === 7) {
            fieldId = 'bott-mid';
        } else if (num === 8) {
            fieldId = 'bott-right';
        } else {
            console.log('Something went wrong in indexToId()', num);
        }
        return fieldId;
    }

    //I tried to use the Minimax algorithm, but had to give up because my programming skills are not high enough yet :(
    //Moreover, to do so would have to rewrite most of my code from scratch.
    //However - as far as I can tell - my if-else algorithm is just as good as the minimax but it's a lot quicker than MM, so it will do for now.
    //In addition, with my solution, one can easily set 3 levels of difficulty
    function returnAIindex() {
        var x = checkIfWin(gameArr, 'X');
        var o = checkIfWin(gameArr, 'O');
        //takes middle if available
        if (gameArr[4] === 0) {
            return 4;
        }
        //finding the win scenario or blocks opponet moves for human player 'X'
        if (clicked === 'X') {
            //First look for win scenario - [level 'HARD' only]
            if ((o || o === 0) && dl === 'hard') {
                return o;
                //If not found then try to block opponent's move - [level 'HARD' and 'MEDIUM']
            } else if ((x || x === 0) && ((dl === 'hard') || dl === 'medium')) {
                return x;
            }
        }
        //Same as above but for human player 'O'
        if (clicked === 'O') {
            if ((x || x === 0) && dl === 'hard') {
                return x;
            } else if ((o || o === 0) && ((dl === 'hard') || dl === 'medium')) {
                return o;
            }
        }

        //AI takes corners of the board if available - ['HARD' only]
        if (gameArr[0] === 0 && (dl === 'hard')) {
            return 0;
        } else if (gameArr[2] === 0 && dl === 'hard') {
            return 2;
        } else if (gameArr[6] === 0 && dl === 'hard') {
            return 6;
        } else if (gameArr[8] === 0 && dl === 'hard') {
            return 8;
        }
        //checks if there are still empty fields on the board
        var haveRoom = false;
        for (var i = 0; i < 9; i = i + 1) {
            if (gameArr[i] === 0) {
                haveRoom = true;
            }
        }

        //gets random index from what is left on the board - [all levels]
        while (haveRoom) {
            var moveAI = Math.floor((Math.random() * 9));
            if (gameArr[moveAI]) {
                moveAI = Math.floor((Math.random() * 9));
            } else {
                break;
            }
        }
        return moveAI;
    }

    function placeSymbol(id, sym) {
        $('#' + id).html(sym);
    }

    function checkIfWin(someArr, r) {
        flag = false; //this is the false flag ( ͡° ͜ʖ ͡°)
        var arr = [[0, 3, 6], [1, 4, 7], [2, 5, 8], [2, 4, 6], [0, 4, 8], [0, 1, 2], [3, 4, 5], [6, 7, 8]]; //win scenarios
        var hitCounterX = 0;
        var hitCounterO = 0;
        var arrX = [];
        var arrO = [];
        var logX = [];
        var logO = [];
        for (var i = 0; i < arr.length; i = i + 1) {
            for (var j = 0; j < arr[i].length; j = j + 1) {
                if (someArr[arr[i][j]] === 'X') {
                    arrX.push(arr[i][j]);
                    hitCounterX = hitCounterX + 1;
                }
                if (someArr[arr[i][j]] === 'O') {
                    arrO.push(arr[i][j]);
                    hitCounterO = hitCounterO + 1;
                }
                //Trying to find winning array
                if (hitCounterX === 3) {
                    win = true;
                    winner = 'X';
                    winScenario = arr[i];
                    break;
                } else if (hitCounterO === 3) {
                    win = true;
                    winner = 'O';
                    winScenario = arr[i];
                    break;
                    //if last iteration of both loops won't give win=true and there is no more room on the board, then win='draw'
                } else if (someArr.indexOf(0) === -1 && i === 7 && j === 2 && (hitCounterO < 3 && hitCounterX < 3) && win != true) {
                    win = 'draw';
                    //checks if player has chance to win in next move and returns index of field to block him or let him win if so
                } else if (hitCounterO === 2 && r === 'O' && logO.indexOf(i) === -1) {
                    logO.push(i); //Log for already block win scenarios indexes
                    arrO = arr[i].filter(function (a) {
                        return arrO.indexOf(a) === -1; //Return arrO as index of 3rd move to block opponent or to win
                    });
                    if (gameArr[arrO[0]] === 0) { //Check if there is a room on board and if so return valid move index
                        return arrO[0];
                    } else {
                        arrO = [];
                    }
                } else if (hitCounterX === 2 && r === 'X' && logX.indexOf(i) === -1) {
                    logX.push(i);
                    arrX = arr[i].filter(function (a) {
                        return arrX.indexOf(a) === -1;
                    });
                    if (gameArr[arrX[0]] === 0) {
                        return arrX[0];
                    } else {
                        arrX = [];
                    }
                }
            }
            arrX = [];
            arrO = [];
            hitCounterX = 0;
            hitCounterO = 0;
        }
        return win;
    }
    //Adds moves to game matrix array and resets the board if win or draw
    function addToGameArr(ind, sym) {
        if (gameArr[ind] === 0) {
            flag1 = 1;
            gameArr[ind] = sym;
            checkIfWin(gameArr);
            if (win === true) {
                $('#x').removeClass('active');
                $('#o').removeClass('active');
                placeSymbol(indexToId(ind), sym);
                toggleWinnerLine(0);
                gameArr = [0, 0, 0, 0, 0, 0, 0, 0, 0];
                win = false;
                winner = undefined;
                clicked = undefined;
                flag = true;
                flag1 = 0;
                tempArr = [];
            } else if (win === 'draw') {
                $('#x').removeClass('active');
                $('#o').removeClass('active');
                placeSymbol(indexToId(ind), sym);
                gameArr = [0, 0, 0, 0, 0, 0, 0, 0, 0];
                win = false;
                winner = undefined;
                clicked = undefined;
                flag = true;
                flag1 = 0;
                tempArr = [];
            } else {
                placeSymbol(indexToId(ind), sym);
            }
        } else {
            return;
        }
    }
    //triggered by clicking 'X' or 'O'
    function play() {
        indexOfClick = $('.field').index(this);
        if (clicked === 'O' && (gameArr.indexOf('X') === -1 && gameArr.indexOf('O') === -1)) {
            addToGameArr(returnAIindex(), 'X');
        } else if (clicked === 'X' && gameArr[indexOfClick] === 0 && indexOfClick >= 0 && this) {
            addToGameArr(indexOfClick, 'X');
            if (gameArr.indexOf('X') != -1) {
                addToGameArr(returnAIindex(), 'O');
            }
        } else if (clicked === 'O') {
            flag1 = 0;
            addToGameArr(indexOfClick, 'O');
            if (gameArr.indexOf(0) != -1 && flag1 === 1) { //flag1 is set to 1 only if previous player's move was valid, otherwise flag1 = 0
                addToGameArr(returnAIindex(), 'X');
            }
        }
    }

    //removes or adds winner line highlighting
    function toggleWinnerLine(s) {
        if (s === 0) {
            for (var i = 0; i < winScenario.length; i = i + 1) {
                $('#' + indexToId(winScenario[i])).addClass('win');
            }
        } else if (s === 1) {
            for (var i = 0; i < winScenario.length; i = i + 1) {
                $('#' + indexToId(winScenario[i])).removeClass('win');
            }
        }
    }
    //clears board before next game
    function clearBoard() {
        gameArr = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        if (win != 'draw') {
            toggleWinnerLine(1);
        }
        $('.field').html('');
        win = false;
    }
});
