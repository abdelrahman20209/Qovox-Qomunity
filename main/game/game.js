document.addEventListener('mousemove', (e) => {
    document.documentElement.style.setProperty('--x', e.clientX + 'px');
    document.documentElement.style.setProperty('--y', e.clientY + 'px');
});

let reveals=document.querySelectorAll(".reveal")

function reveal(){

for(let i=0;i<reveals.length;i++){

let windowHeight=window.innerHeight
let elementTop=reveals[i].getBoundingClientRect().top
let visible=120

if(elementTop<windowHeight-visible){

reveals[i].classList.add("active")

}

}

}

window.addEventListener("scroll",reveal)

reveal()


let bg=document.querySelector(".bg")

document.addEventListener("mousemove",(e)=>{

let x=(e.clientX- window.innerWidth/2)/40
let y=(e.clientY- window.innerHeight/2)/40

bg.style.transform="translate("+x+"px,"+y+"px)"

})


let buttons=document.querySelectorAll(".game-btn")

buttons.forEach(btn=>{

btn.addEventListener("mousemove",(e)=>{

let x=e.offsetX
let y=e.offsetY

btn.style.setProperty("--x",x+"px")
btn.style.setProperty("--y",y+"px")

})

})