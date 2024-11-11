var lattice = [];
var added = [];
var t;
var n;
var gen=0;
var iter=0;

checkbox = document.getElementById('myCheckbox');

document.getElementById('myCheckbox').addEventListener('change', function(e) {
	toggleValues(e.target.checked);
});

function toggleValues(action){
	lefts = document.getElementsByClassName('left')
	tops = document.getElementsByClassName('top')
	centers = document.getElementsByClassName('center');
	elems = [...lefts, ...tops, ...centers];
	if (action == true){
		for(let elem of elems){
			elem.style.visibility = 'visible';
		}
	} 
	else{
		for(let elem of elems){
			elem.style.visibility = 'hidden';
		}
	}
}

function truncateDecimals(number, digits) {
    var multiplier = Math.pow(10, digits),
        adjustedNum = number * multiplier,
        truncatedNum = Math[adjustedNum < 0 ? 'ceil' : 'floor'](adjustedNum);

    return truncatedNum / multiplier;
};

class complex{
	constructor(real, imag){
		this.real = real;
		this.imag = imag;
	}
	add(c){
		var real = this.real + c.real;
		var imag = this.imag + c.imag;
		return new complex(real, imag);
	}
	multiply(c){
		var real = this.real*c.real - this.imag*c.imag;
		var imag = this.real*c.imag + this.imag*c.real;
		return new complex(real, imag);
	}
	abs(){
		return Math.sqrt(this.real*this.real + this.imag*this.imag);
	}
	conj(){
		return new complex(this.real, -1*this.imag);
	}
	print(){
		if (this.imag < 0){
			return truncateDecimals(this.real,2) + "-i" + -1*truncateDecimals(this.imag,2);
		} else
		return truncateDecimals(this.real,2) + "+i" + truncateDecimals(this.imag,2);
	}
}

function randomComplex(){
	var theta = Math.random()*2*Math.PI;
	var c = new complex(Math.cos(theta), Math.sin(theta));
	return c;
}


function getPlaquettes(){
	var plaquettes = [];
	for(let i=0;i<n;i++){
		plaquettes.push([]);
		for(let j=0; j<n; j++){
			var temp = new complex(1,0);
			temp = temp.multiply(lattice[i][j].top.conj());
			temp = temp.multiply(lattice[i][j].left);
			if(i==n-1) temp = temp.multiply(lattice[0][j].top); else temp  = temp.multiply(lattice[i+1][j].top);
			if(j==n-1) temp = temp.multiply(lattice[i][0].left.conj()); else temp = temp.multiply(lattice[i][j+1].left.conj());
			plaquettes[i].push(temp);
		}
	}
	return plaquettes;
}

function drawBoard(){
	var board = document.getElementById("board")
	var tiles = '';
	plaquettes = getPlaquettes();
	for(i=0;i<n;i++){
		for(j=0; j<n; j++){
			if (lattice[i][j].lfixed) var lcolor = 'black'; else var lcolor = 'white';
			if (lattice[i][j].bfixed) var bcolor = 'black'; else var bcolor = 'white';
			
			tiles = tiles + `<div id="t_${i}_${j}" class="tile" style="border-left-color:${lcolor}; border-top-color: ${bcolor}"><div id="left_${i}_${j}" class="left">${lattice[i][j].left.print()}</div><div id="top_${i}_${j}" class="top">${lattice[i][j].top.print()}</div><div id="center_${i}_${j}" class="center" style="font-weight: bold">${plaquettes[i][j].print()}</div></div>`;

		}
	}
	board.innerHTML = tiles;
	toggleValues(checkbox.checked);
}

function clearBoard(){
	clearTimeout(t);
	gen = 0;
	lattice = [];
	
	added = [];
	for(let i=0;i<n;i++){
		lattice.push([]);
		for(let j=0; j<n; j++){
			lattice[i].push({'left': randomComplex(), 'top': randomComplex(), 'omega': new complex(1,0), 'lfixed': false, 'bfixed': false});
		}
	}
	drawBoard();
}

function initialize(){
	n = parseInt(document.getElementById("number").value);
	document.documentElement.style.setProperty('--x', n);
	clearBoard();
}

function randomSubsetGenerator(arr){
	var subset = [];
	for(let i=0;i<arr.length;i++){
		if (Math.random() < 0.25){
			subset.push(arr[i]);
		}
	}
	return subset;
}

function randomSubset(arr){
	if(arr.length == 0){
		console.log("Error: empty array");
		return [];
	}
	if  (arr.length == 1){
		return arr;
	}
	while(true){
		var subset = randomSubsetGenerator(arr);
		if (subset.length != 0){
			return subset;
		}
	}
}

function recalculate(i, j){
	if (i == n-1) var neigh = {'i': 0, 'j': j};
	else var neigh = {'i': i+1, 'j': j};
	lattice[i][j].left = lattice[i][j].omega.multiply(lattice[i][j].left);

	if (j == n-1) var neigh = {'i': i, 'j': 0};
	else var neigh = {'i': i, 'j': j+1};
	lattice[i][j].top = lattice[i][j].omega.multiply(lattice[i][j].top);

	if (i == 0) var neigh = {'i': n-1, 'j': j};
	else var neigh = {'i': i-1, 'j': j};
	lattice[neigh.i][neigh.j].left = lattice[neigh.i][neigh.j].left.multiply(lattice[i][j].omega.conj());

	if (j == 0) var neigh = {'i': i, 'j': n-1};
	else var neigh = {'i': i, 'j': j-1};
	lattice[neigh.i][neigh.j].top = lattice[neigh.i][neigh.j].top.multiply(lattice[i][j].omega.conj());
	
	lattice[i][j].omega = new complex(1,0);

}

function addOneLayer(){
	let neighbours = [];
	for(let temp=0; temp < added.length; temp++){

		if (added[temp].i == n-1) var neigh = {'i': 0, 'j': added[temp].j};
		else var neigh = {'i': added[temp].i+1, 'j': added[temp].j};
		if (!added.some(item => item.i === neigh.i && item.j === neigh.j)) neighbours.push({'ii': added[temp].i, 'ji': added[temp].j, 'i':neigh.i, 'j':neigh.j}); 

		if (added[temp].j == n-1) var neigh = {'i': added[temp].i, 'j': 0};
		else var neigh = {'i': added[temp].i, 'j': added[temp].j+1};
		if (!added.some(item => item.i === neigh.i && item.j === neigh.j)) neighbours.push({'ii': added[temp].i, 'ji': added[temp].j, 'i':neigh.i, 'j':neigh.j});

		if (added[temp].i == 0) var neigh = {'i': n-1, 'j': added[temp].j};
		else var neigh = {'i': added[temp].i-1, 'j': added[temp].j};
		if (!added.some(item => item.i === neigh.i && item.j === neigh.j)) neighbours.push({'ii': added[temp].i, 'ji': added[temp].j, 'i':neigh.i, 'j':neigh.j});

		if (added[temp].j == 0) var neigh = {'i': added[temp].i, 'j': n-1};
		else var neigh = {'i': added[temp].i, 'j': added[temp].j-1};
		if (!added.some(item => item.i === neigh.i && item.j === neigh.j)) neighbours.push({'ii': added[temp].i, 'ji': added[temp].j, 'i':neigh.i, 'j':neigh.j});

	}
	var subset = randomSubset(neighbours);

	for (let pair of subset){

		if(added.some(item => item.i === pair.i && item.j === pair.j)) continue;
	
		added.push({'i': pair.i, 'j': pair.j});

		if (pair.ii == pair.i){
			if (pair.j == n-1 && pair.ji == 0 ){
				lattice[pair.i][pair.j].omega = lattice[pair.ii][pair.ji].omega.multiply(lattice[pair.i][pair.j].top.conj());
				recalculate(pair.i, pair.j);
				lattice[pair.i][pair.j].bfixed = true;
				continue;
			} 
			if (pair.j == 0 && pair.ji == n-1){
				lattice[pair.i][pair.j].omega = lattice[pair.ii][pair.ji].omega.multiply(lattice[pair.ii][pair.ji].top);
				recalculate(pair.i, pair.j);
				lattice[pair.ii][pair.ji].bfixed = true;
				continue;
			}
			if(pair.j > pair.ji){
				lattice[pair.i][pair.j].omega = lattice[pair.ii][pair.ji].omega.multiply(lattice[pair.ii][pair.ji].top);
				recalculate(pair.i, pair.j);
				lattice[pair.ii][pair.ji].bfixed = true;
				continue;
			}
			if(pair.j < pair.ji){
				lattice[pair.i][pair.j].omega = lattice[pair.ii][pair.ji].omega.multiply(lattice[pair.i][pair.j].top.conj());
				recalculate(pair.i, pair.j);
				lattice[pair.i][pair.j]. bfixed = true;
				continue;
			}
		}
		else {
			if (pair.i == n-1 && pair.ii == 0 ){
				lattice[pair.i][pair.j].omega = lattice[pair.ii][pair.ji].omega.multiply(lattice[pair.i][pair.j].left.conj());
				recalculate(pair.i, pair.j);
				lattice[pair.i][pair.j].lfixed = true;
				continue;
			} 
			if (pair.i == 0 && pair.ii == n-1){
				lattice[pair.i][pair.j].omega = lattice[pair.ii][pair.ji].omega.multiply(lattice[pair.ii][pair.ji].left);
				recalculate(pair.i, pair.j);
				lattice[pair.ii][pair.ji].lfixed = true;
				continue;
			}
			if(pair.i > pair.ii){
				lattice[pair.i][pair.j].omega = lattice[pair.ii][pair.ji].omega.multiply(lattice[pair.ii][pair.ji].left);
				recalculate(pair.i, pair.j);
				lattice[pair.ii][pair.ji].lfixed = true;
				continue;
			}
			if(pair.i < pair.ii){
				lattice[pair.i][pair.j].omega = lattice[pair.ii][pair.ji].omega.multiply(lattice[pair.i][pair.j].left.conj());
				recalculate(pair.i, pair.j);
				lattice[pair.i][pair.j].lfixed = true;
				continue;
			}

		}
			
	}
	
	drawBoard();


}


function start(){
	if(added.length ==0){
		rnd_i = Math.floor(Math.random()*n);
		rnd_j = Math.floor(Math.random()*n);
		// rnd_i = 0;
		// rnd_j = 0;
		added.push({'i': rnd_i, 'j': rnd_j});
	}
	if(added.length == n*n){
		return;
	}
	else{
		addOneLayer();
		t = setTimeout(start, 100);
	}
}

function stop(){
	clearTimeout(t);
}





initialize();



