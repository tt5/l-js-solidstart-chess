var a = 0
var makestar = []
var rr = new Set()
var rt = new Set()
var tt = new Set()
var lt = new Set()
var ll = new Set()
var lb = new Set()
var bb = new Set()
var rb = new Set()
var fullrow = new Set([0,1,2,3,4,5,6,7])
var fullcol = new Set([0,8,16,24,32,40,48,56])
var fulldlr = new Set([0,9,18,27,36,45,54,63])
var fulldrl = new Set([7,14,21,28,35,42,49,56])
for (let i=0; i<8; i++) {
  for (let j=0; j<8; j++) {
    a = i*8+j


    for (let l=0; l<j; l++) {
      ll.add(l+(8*i))
    }
    rr = new Set([...fullrow].map(x => x+8*i).filter(x => !ll.has(x)))

    for (let l=j; l<=a; l=l+8) {
      tt.add(l)
    }
    bb = new Set([...fullcol].map(x => x+j).filter(x => !tt.has(x)))

    for (let l=j-i; l<=a; l=l+8+1) {
      lt.add(l)
    }
    rb = new Set([...fulldlr].map(x => x+j-i).filter(x => !lt.has(x)))

    for (let l=i+j; l<=a; l=l+8-1) {
      rt.add(l)
    }
    lb = new Set([...fulldrl].map(x => x + (j-(8-i)+1)).filter(x => !rt.has(x)))

    var overrb = (8-i)
    var overlb = (8-i)
    var overrt = 0
    var overlt = 0
    if ((8-i) > (8-j)) {overrb = (8-j)}
    if ((8-i) > j) {overlb = j}
    if (i > (8-j)) {overrt = i - (8-j) + 1}
    if (i > j) {overlt = i - j}
    makestar.push([
      [...rr].slice(1),
      [...rt].slice(overrt, -1).reverse(),
      [...tt].slice(0, -1).reverse(),
      [...lt].slice(overlt, -1).reverse(),
      [...ll].reverse(),
      [...lb].slice(0, overlb),
      [...bb],
      [...rb].slice(0, overrb-1),
    ])
    rr.clear()
    rt.clear()
    tt.clear()
    lt.clear()
    ll.clear()
    lb.clear()
    bb.clear()
    rb.clear()
  }
}

export const star = makestar
