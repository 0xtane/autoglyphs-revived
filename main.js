////////////////////////////
// forgive for low quality, some parts were written in a hurry
window.data={};
window.data.displaying=false;
window.data.totalShown = 0;

const amountToShow = 100;
const lastSeed = 1000;

//displayMore();

gid("gen-btn").addEventListener("click",onClickGenBtn);

// FOR LOADING DATA ON SCROLL
window.addEventListener("scroll", () => {
	const { scrollHeight, scrollTop, clientHeight } = document.documentElement;

	if (scrollTop + clientHeight >= scrollHeight) {
		displayMore();
	}
});

var GlyphStrings = [];

async function fetchGlyphStrings() {
	for (var i = 1;i<=lastSeed;i++) {
		saveString(i);
	}

	async function saveString(id) {
		let glyphString = await (await fetch(`results/${id}.txt`)).text();
		GlyphStrings[id]=glyphString;
	}
}

fetchGlyphStrings();

/////////////////
async function generate(id, c) {
	x = c.getContext("2d");
	c.width |= 0;

	x.fillStyle = "white";
	x.fillRect(0, 0, c.width, c.height);

	//let glyphString = await (await fetch(`results/${id}.txt`)).text();
	let glyphString = GlyphStrings[id];
	//console.log(glyphString);

	glyphString = glyphString.substring(30).split("%0A");
	for (let i = 1; i < glyphString.length - 1; i++) {
		for (let c = 1; c <= glyphString[i].length - 1; c++) {
			x.strokeStyle = "black";
			x.lineWidth = 2;
			x.beginPath();

			if (glyphString[i].charAt(c) == "O") {
				x.arc(c * 15, i * 15, 15 / 2, 0, 2 * Math.PI);
			} else if (glyphString[i].charAt(c) == "+") {
				x.moveTo(c * 15, i * 15 - 15 / 2);
				x.lineTo(c * 15, i * 15 + 15 / 2);

				x.moveTo(c * 15 - 15 / 2, i * 15);
				x.lineTo(c * 15 + 15 / 2, i * 15);
			} else if (glyphString[i].charAt(c) == "|") {
				x.moveTo(c * 15, i * 15 - 15 / 2);
				x.lineTo(c * 15, i * 15 + 15 / 2);
			} else if (glyphString[i].charAt(c) == "-") {
				x.moveTo(c * 15 - 15 / 2, i * 15);
				x.lineTo(c * 15 + 15 / 2, i * 15);
			} else if (glyphString[i].charAt(c) == "X") {
				x.moveTo(c * 15 - 15 / 2, i * 15 - 15 / 2);
				x.lineTo(c * 15 + 15 / 2, i * 15 + 15 / 2);

				x.moveTo(c * 15 + 15 / 2, i * 15 - 15 / 2);
				x.lineTo(c * 15 - 15 / 2, i * 15 + 15 / 2);
			} else if (glyphString[i].charAt(c) == "\\") {
				x.moveTo(c * 15 - 15 / 2, i * 15 - 15 / 2);
				x.lineTo(c * 15 + 15 / 2, i * 15 + 15 / 2);
			} else if (glyphString[i].charAt(c) == "/") {
				x.moveTo(c * 15 + 15 / 2, i * 15 - 15 / 2);
				x.lineTo(c * 15 - 15 / 2, i * 15 + 15 / 2);
			} else if (glyphString[i].charAt(c) == "#") {
				x.fillStyle = "black";
				x.fillRect(c * 15 - 15 / 2, i * 15 - 15 / 2, 15, 15);
			}

			x.stroke();
		}
	}
	return;
}

async function displayMore() {

	if (data.displaying || !data.startPoint || (data.startPoint + data.totalShown)>lastSeed ) {

		return;
	}
	data.displaying=true;
	var canvas, a, img, currentID, wrapper, seed;
	for (var i = 0; i < amountToShow; i++) {
		wrapper = document.createElement("div");
		wrapper.classList.add("wrapper");
		currentID = data.startPoint + data.totalShown;
		if (currentID>lastSeed) {
			data.displaying=false;
			return;
		};
		canvas = document.createElement("canvas");
		canvas.width = "1024";
		canvas.height = "1024";
		canvas.setAttribute("data-id", currentID);
		await generate(currentID, canvas);
		img = document.createElement("img");
		img.src = canvas.toDataURL("image/png");
		seed = document.createElement("h4");
		seed.textContent = "Seed : " + currentID;
		wrapper.appendChild(seed);
		wrapper.appendChild(img);
		a = document.createElement("a");
		a.textContent = "Download source";
		a.href = "results/" + currentID + ".txt";
		a.download = currentID + ".txt";
		wrapper.appendChild(a);
		gid("container").appendChild(wrapper);
		data.totalShown++;
	}
	data.displaying=false;
}
function gid(a) {
	return document.getElementById(a);
}

async function onClickGenBtn(){

	const val = gid("gen-startpoint").value;
	var correct = true;
	if (!val) return;
	try {
		if (parseInt(val)<1 || parseInt(val)>lastSeed) {
			correct = false;
		}
	} catch (err) {
		console.error(err);
		correct = false;
	}
	if (!correct) return;

	data.startPoint=parseInt(val);

	gid("input-container").style.display="none";
	displayMore();
}
