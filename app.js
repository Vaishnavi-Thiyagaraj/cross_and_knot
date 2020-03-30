/*****************************************
 *              MODEL                    *
******************************************/


var TicTacToeModel  = function() {
    this.configPlayer = {
        player1: {
            id: 1,
            name: 'I am player 1. Give me a name',
            symbol: 'x',
            score: 0
        },
        player2: {
            id: 2,
            name: 'I am player 2. Give me a name',
            symbol: '0',
            score: 0
        },
        tie: {
            score: 0
        }
    };
    this.winningPlayer = null,
    this.board = Array(9).fill(null),
    this.activePlayer = this.winningPlayer || this.configPlayer.player1
};
TicTacToeModel.prototype.areSameValues = function(index1,index2,index3) {
    return (this.board[index1] !== null) && (this.board[index1] === this.board[index2]) &&
        (this.board[index2] === this.board[index3]);
};
TicTacToeModel.prototype.checkLeftDiagonal = function() {
    return this.areSameValues(0,4,8);
};
TicTacToeModel.prototype.checkRightDiagonal = function() {
    return this.areSameValues(2,4,6);
};
TicTacToeModel.prototype.setBoardCell = function(index,value) {
    this.board[index] = value;
    console.log(this.board);
};
TicTacToeModel.prototype.switchPlayer = function () {
    this.activePlayer = (this.activePlayer.id === 1) ? this.configPlayer.player2 : this.configPlayer.player1;
};
TicTacToeModel.prototype.checkWin = function(index) {
    let isWin = false;
    console.log(index);
    switch(index) {
        case '0': 
           isWin = this.areSameValues(0,3,6) || this.areSameValues(1,2,3) || this.checkLeftDiagonal();
           break;
        case '1': 
           isWin = this.areSameValues(1,4,7) || this.areSameValues(3,4,5);
           break;
        case '2': 
           isWin = this.areSameValues(0,1,2) || this.areSameValues(2,5,8) || this.checkRightDiagonal();
           break;
        case '3': 
           isWin = this.areSameValues(3,4,5) || this.areSameValues(0,3,6);
           break;
        case '4': 
           isWin = this.areSameValues(3,4,5) || this.areSameValues(1,4,7) || this.checkLeftDiagonal() || this.checkRightDiagonal();
           break;
        case '5': 
           isWin = this.areSameValues(3,4,5) || this.areSameValues(2,5,8);
           break;
        case '6': 
           isWin = this.areSameValues(6,7,8) || this.areSameValues(0,3,6) || this.checkLeftDiagonal();
           break;
        case '7': 
           isWin = this.areSameValues(6,7,8) || this.areSameValues(1,4,7);
           break;
        case '8': 
           isWin = this.areSameValues(6,7,8) || this.areSameValues(2,5,8) || this.checkLeftDiagonal();
           break;
    }
    return isWin;
};
TicTacToeModel.prototype.isTie = function() {
    return !this.board.includes(null);
};
TicTacToeModel.prototype.updateCell = function(cellIndex) {
    this.setBoardCell(cellIndex,this.activePlayer.symbol);
    var isTie = this.isTie();
    var isWin = this.checkWin(cellIndex);
    var isGameOver = isWin || isTie;
    //console.log('gameover',isGameOver);
    if(isGameOver) {
        this.winningPlayer = this.activePlayer; 
        if(isWin) {
            this.activePlayer.score += 1;
        } else {
            this.configPlayer.tie.score += 1;
        }
    } else {
        this.switchPlayer(); 
    }
    return {
        gameStatus : {
            isGameOver,
            isTie,
            isWin,
            tieScore : this.configPlayer.tie.score,
            winningPlayer : this.winningPlayer
        },
        playerSymbol : this.activePlayer.symbol
    };
};
TicTacToeModel.prototype.resetModel = function() {
    this.board = Array(9).fill(null);
    this.activePlayer = this.winningPlayer;
};


/*************************************************
 *                     VIEW                      *
 *************************************************/


var TicTacToeView = function() {
    this.title = 'Tic Tac Toe';
};
TicTacToeView.prototype.renderView = function() {
    var counter = 0;

    this.dialog = document.getElementById('dialog');
    document.getElementById('close').addEventListener('click',() => {
        this.dialog.close();
    });

    var container = document.createElement('div');
    container.setAttribute('class','container');

    var titleBar = document.createElement('div');
    titleBar.setAttribute('class','title-bar');
    //titleBar.innerText = 'Tic Tac Toe';

    var player1 = document.createElement('div');
    player1.setAttribute('class','player');
    player1.innerHTML = 'Player 1';

    var player2 = document.createElement('div');
    player2.setAttribute('class','player');
    player2.innerHTML = 'Player 2';

    var tie = document.createElement('div');
    tie.setAttribute('class','player');
    tie.innerHTML = 'Tie';

    this.player1Score = document.createElement('div');
    this.player1Score.setAttribute('class','score-board');
    this.player1Score.innerHTML = '0';

    this.player2Score = document.createElement('div');
    this.player2Score.setAttribute('class','score-board');
    this.player2Score.innerHTML = '0';

    this.tieScore = document.createElement('div');
    this.tieScore.setAttribute('class','score-board');
    this.tieScore.innerHTML = '0';

    titleBar.append(player1, tie, player2, this.player1Score, this.tieScore, this.player2Score);
    this.boardBox = document.createElement('div');
    this.boardBox.setAttribute('class','board');
    for(let i = 0; i < 3; i++) {
        var column = document.createElement('div');
        column.setAttribute('class','column');
        for(let j = 0; j < 3; j++) {
            var cell = document.createElement('div');
            cell.setAttribute('class','cell');
            cell.setAttribute('id',counter++);
            cell.addEventListener('click',this.onClickCell.bind(this));
            column.append(cell);
        } 
        this.boardBox.append(column);
    }

    var button = document.createElement('button');
    button.setAttribute('class','reset');
    button.innerHTML = 'Reset';
    button.addEventListener('click',this.resetBoard.bind(this));

    container.append(titleBar,this.boardBox,button);
    document.getElementById('root').append(container);

};
TicTacToeView.prototype.bindClick = function(handler) {
    this.cellClickhandler = handler;
};
TicTacToeView.prototype.onClickCell = function(e) {
    if(e.target.classList.contains('setCross') || e.target.classList.contains('setNought')) {
        return false;
    }
    console.log(this.boardBox.classList);
   // this.boardBox.classList.toggle('rotated');
    var {gameStatus,playerSymbol} = this.cellClickhandler(e.target.id);
    var cellClass = (playerSymbol === 'x') ? 'cell setCross' : 'cell setNought';
    e.target.setAttribute('class',cellClass);
    console.log(gameStatus.isGameOver,cellClass);
    if(gameStatus.isGameOver) {
        console.log('game over');
        
        this.updateScoreBoard(gameStatus);
        this.displayGameStatus();
    }
};
TicTacToeView.prototype.displayGameStatus = function() {
    if(dialog.showModal) {
        dialog.showModal(); //dialog not supported in safari
    } else {
        alert('Game Over!!!');
    }
    this.resetBoard();
};
TicTacToeView.prototype.updateScoreBoard = function(gameStatus) {
    if(gameStatus.isTie) {
        this.tieScore.innerHTML = gameStatus.tieScore;
    } else {
        console.log(gameStatus.winningPlayer);
        if(gameStatus.winningPlayer.id === 1) {
            this.player1Score.innerHTML = gameStatus.winningPlayer.score;
        } else {
            this.player2Score.innerHTML = gameStatus.winningPlayer.score;
        }
    }
},
TicTacToeView.prototype.bindReset = function(handler) {
    this.resetModel = handler;
};
TicTacToeView.prototype.resetBoard = function() {
    var htmlcell = this.boardBox.querySelectorAll('.cell'); 
    console.log(htmlcell);
    htmlcell.forEach(function(val) {
        val.setAttribute('class','cell');
    });
    this.resetModel();
};

window.onload = function() {
    var c = new controller(new TicTacToeModel(), new TicTacToeView());
    c.view.bindClick(c.handleClick.bind(c));
    c.view.bindReset(c.reset.bind(c));
};




/****************************************************
 *                 CONTROLLER                       *
 ****************************************************/
var controller = function(model,view) {
    this.model = model;
    this.view = view;
    this.renderBoaard();
};
controller.prototype.renderBoaard = function() {
    this.view.renderView();
};
controller.prototype.handleClick = function(cellIndex) {
    return this.model.updateCell(cellIndex);
};
controller.prototype.reset = function() {
    this.model.resetModel();
};

