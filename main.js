
var totalShown=0;


displayMore();
gid("displaymore-btn").onclick=function(){
  displayMore();
};


async function generate(id,c,x) {
    c.width|=0;

    x.fillStyle = "white";
    x.fillRect(0, 0, c.width, c.height);

    let glyphString = await (await fetch(`results/${id}.txt`)).text();
    //console.log(glyphString);

    glyphString = glyphString.substring(30).split("%0A");
    for (let i = 1; i < glyphString.length-1; i++) {
        for (let c = 1; c <= glyphString[i].length-1; c++) {
            x.strokeStyle = "black";
            x.lineWidth = 2;
            x.beginPath();

            if (glyphString[i].charAt(c) == "O") {
                x.arc(c*15, i*15, 15/2, 0, 2 * Math.PI);
            } else if (glyphString[i].charAt(c) == "+") {
                x.moveTo(c*15, i*15-15/2);
                x.lineTo(c*15, i*15+15/2);

                x.moveTo(c*15-15/2, i*15);
                x.lineTo(c*15+15/2, i*15);
            } else if (glyphString[i].charAt(c) == "|") {
                x.moveTo(c*15, i*15-15/2);
                x.lineTo(c*15, i*15+15/2);
            } else if (glyphString[i].charAt(c) == "-") {
                x.moveTo(c*15-15/2, i*15);
                x.lineTo(c*15+15/2, i*15);
            } else if (glyphString[i].charAt(c) == "X") {
                x.moveTo(c*15-15/2, i*15-15/2);
                x.lineTo(c*15+15/2, i*15+15/2);

                x.moveTo(c*15+15/2, i*15-15/2);
                x.lineTo(c*15-15/2, i*15+15/2);
            } else if (glyphString[i].charAt(c) == "\\") {
                x.moveTo(c*15-15/2, i*15-15/2);
                x.lineTo(c*15+15/2, i*15+15/2);
            } else if (glyphString[i].charAt(c) == "/") {
                x.moveTo(c*15+15/2, i*15-15/2);
                x.lineTo(c*15-15/2, i*15+15/2);
            } else if (glyphString[i].charAt(c) == "#") {
                x.fillStyle = "black"
                x.fillRect(c*15-15/2, i*15-15/2, 15, 15)
            }

            x.stroke();

        }
    }
}


async function displayMore() {
  var c,x,a;
  for (var i=0;i<5;i++) {
    c = document.createElement("canvas");
    c.width="1024";
    c.height="1024";
    c.setAttribute("data-id",totalShown+1);
    x = c.getContext("2d");
    await generate(totalShown+1,c,x)
    gid("container").appendChild(c);

    a = document.createElement("a");
    a.textContent="^ Download ASCII for - "+(totalShown+1);
    a.href="results/"+(totalShown+1)+".txt";
    a.download=(totalShown+1)+".txt";
    gid("container").appendChild(a);
    totalShown++;
  }
}
function gid(a){return document.getElementById(a)};
