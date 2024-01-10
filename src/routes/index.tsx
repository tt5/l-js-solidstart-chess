import { createSignal, For } from "solid-js";

import {
  bpawn, brook, bknight, bbishop, bqueen, bking,
  wpawn, wrook, wknight, wbishop, wqueen, wking
} from "../data/pieces"; 
import { star } from "../data/star";
//console.log(star[0][0])

export default function Home() {

  const [activeSquare, setActiveSquare] = createSignal(0)
  const [hoverSquare, setHoverSquare] = createSignal(0)
  const [cursor, setCursor] = createSignal("M50 0 L0 100 L100 100 Z")
  const [cursorPos, setCursorPos] = createSignal({x: 0, y:0})
  const [squareSize, setSquareSize] = createSignal(80)
  const [clicked, setClicked] = createSignal(false)
  const [started, setStarted] = createSignal(false)

  const [startPos, setStartPos] = createSignal([
    'r','n','b','q','k','b','n','r',
    'p','p','p','p','p','p','p','p',
    'e','e','e','e','e','e','e','e',
    'e','e','e','e','e','e','e','e',
    'e','e','e','e','e','e','e','e',
    'e','e','e','e','e','e','e','e',
    'P','P','P','P','P','P','P','P',
    'R','N','B','Q','K','B','N','R',
  ])

  var setupPos = [];
  var count = 1
  startPos().map(square => {
    //console.log(square)
    switch (square) {
      case 'r':
        //console.log("r", square, count)
        setupPos.push(brook)
        break;
      case 'n':
        setupPos.push(bknight)
        break;
      case 'b':
        setupPos.push(bbishop)
        break;
      case 'q':
        setupPos.push(bqueen)
        break;
      case 'k':
        setupPos.push(bking)
        break;
      case 'p':
        setupPos.push(bpawn)
        break;
      case 'R':
        setupPos.push(wrook)
        break;
      case 'N':
        setupPos.push(wknight)
        break;
      case 'B':
        setupPos.push(wbishop)
        break;
      case 'Q':
        setupPos.push(wqueen)
        break;
      case 'K':
        setupPos.push(wking)
        break;
      case 'P':
        setupPos.push(wpawn)
        break;
      case 'e':
        setupPos.push(["", ""])
        break;
    }
  })
  //console.log(setupPos)

  const  [pos, setPos] = createSignal([
    "", "", "", "", "", "", "", "",
    "", "", "", "", "", "", "", "",
    "", "", "", "", "", "", "", "",
    "", "", "", "", "", "", "", "",
    "", "", "", "", "", "", "", "",
    "", "", "", "", "", "", "", "",
    "", "", "", "", "", "", "", "",
    "", "", "", "", "", "", "", "",
  ])

  setPos(setupPos);

  function handleMouseMove(e: any) {
    setCursorPos({
      x: e.clientX,
      y: e.clientY,
    })
  };

let draggedItem = null;

function handleDragStart(e) {
  e.target.childNodes[0].style.visibility="visible"
  if (!started()) {
    console.log("start")
    //e.target.dataset.from="0-1"
    e.target.dataset.from=e.target.parentNode.id
  }
  draggedItem = e.target.innerHTML;
  e.target.innerHTML = ''
  console.log("start", draggedItem, e.target)
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 1;
  canvas.getContext("2d");

  e.dataTransfer.setData('text/html', draggedItem)
  e.dataTransfer.setDragImage(canvas, 999, 999);
}

function handleDrop(e) {
  setStarted(true)
  setClicked(false)
  e.preventDefault();
  var data = e.dataTransfer.getData("text/html");
  data = `
    <div
    onMouseDown={console.log("down")}
      data-from='${e.target.parentNode.id}'
      draggable="true"
      class="h-full w-full"
  >${data}</div>`
  
  e.target.outerHTML = data;
  draggedItem=''
  var oldPos = pos()
  oldPos[hoverSquare()] = oldPos[activeSquare()]
  oldPos[activeSquare()] = ["", ""]
  console.log("drop", data)
}

function handleDragEnd(e) {
  const border = document.getElementById("board").getBoundingClientRect()
  setClicked(false)
  if ((e.clientX > border.left) && (e.clientX < border.right) && (e.clientY > border.top) && (e.clientY < border.bottom)) {
    console.log("OK")
  } else {
  var data = e.dataTransfer.getData("text/html");
  data = `
    <div
    onMouseDown={console.log("down")}
      data-from='${e.target.dataset.from}'
      draggable="true"
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      class="h-full w-full"
  >${data}</div>`
  document.getElementById(`${e.target.dataset.from}`).innerHTML = data
  }
  console.log("end", data, e.target.dataset.from, e.screenX, e.screenY, e.clientX, e.clientY, border)
  e.preventDefault()
}

function handleDragOver(e) {
  e.preventDefault()
  setCursorPos({
    x: e.clientX,
    y: e.clientY,
  })
  var x = e.target.parentNode.id.split("-")[0]
  var y = e.target.parentNode.id.split("-")[1]
  setHoverSquare(x * 8 + y * 1)
  //console.log(hoverSquare())
}

function handleMouseDown(e) {
  //setCursor(e.target.childNodes[0].childNodes[0])
  var x = e.target.parentNode.id.split("-")[0]
  var y = e.target.parentNode.id.split("-")[1]
  setActiveSquare(x * 8 + y * 1)
  e.target.childNodes[0].style.visibility="hidden"
  setClicked(true)
  //console.log("mousedown", e.target.parentNode.id, e.target.childNodes[0].childNodes[0], e.target.parentNode)
}

function handleMouseUp(e) {
  e.target.childNodes[0].style.visibility="visible"
  setClicked(false)
  console.log("mouseup", e.target.childNodes[0])
}

  return (
    <main
    onMouseMove={handleMouseMove}
    onDragOver={handleDragOver}>
    <h1
    id="myid"
    >hello</h1>
    <div id="board" class="bg-blue-200">



        <svg 
        class="cursor" style={{top: `${cursorPos().y - squareSize()/2}px`, "left": `${cursorPos().x - squareSize()/2}px`, "visibility": `${clicked() ? "visible" : "hidden"}`}} height={squareSize()} width={squareSize()} viewBox="0 0 45 45">
          <g style="opacity:1; fill:#000000; fill-opacity:1; fill-rule:evenodd; stroke:#000000; stroke-width:1.5; stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4; stroke-dasharray:none; stroke-opacity:1;">
            <For each={pos()[activeSquare()]} fallback="">
            {(i) => {
            return(<path d={i[0]} style={i[1]}/>)}
            }
            </For>
          </g>
        </svg>
        <For each={Array.from({length: 8}, (_, i) => i)} >
        {(i) => <div>
          <div class="flex max-w-16">
            <For each={Array.from({length: 8}, (_, i) => i)} fallback="">
              {(j) => <div
                    id={`${i}-${j}`}
      onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
                    onDragEnd={handleDragEnd}
                    onDragStart={handleDragStart}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                 class={
                  ((i % 2) ? 
                    (j % 2) ? "bg-white" : "bg-neutral-400"
                   : 
                    (j % 2) ? "bg-neutral-400" : "bg-white"
                    )
                     + "  h-20 w-20"}>
                 <div 
                    draggable="true"
                    class="h-full w-full"
                    >
    <svg style="pointer-events: none" class="square" xmlns="http://www.w3.org/2000/svg" version="1.1" x="0" y="0" width="100%" height="100%" viewBox="0 0 45 45">
          <g style="opacity:1; fill:#000000; fill-opacity:1; fill-rule:evenodd; stroke:#000000; stroke-width:1.5; stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4; stroke-dasharray:none; stroke-opacity:1;">
            <For each={pos()[i*8+j]} fallback="">
            {(i) => {
            //console.log(i[0])
            return(<path d={i[0]} style={i[1]}/>)}
            }
            </For>
          </g>
</svg>
                 </div>
                </div>
              }
            </For>
          </div>
        </div>
        }
        </For>
        </div>
    </main>
  )
}
