document.querySelector("#welcome button").addEventListener("click",function(){
    document.querySelector("#pop").style.display="initial"
    document.querySelector("#overlay").style.display="initial"
})

document.querySelector("#member a").addEventListener("click",function(){
    document.querySelector("#pop").style.display="none"
    document.querySelector("#login-pop").style.display="initial"
})  
document.querySelector("#login-pop button").addEventListener("click",function(){
    document.querySelector("#overlay").style.display="none"
    document.querySelector("#login-pop").style.display="none"
}) 
document.querySelector("#reg-icon").addEventListener("click",function(){
    document.querySelector("#overlay").style.display="none"

})

// let tl = gsap.timeline({
//     // yes, we can add it to an entire timeline!
//     scrollTrigger: {
//       trigger: "#about",
//     //   pin: true,
//       start: "top 80%",
//       end: "+=500",
//       scrub: 2,
//     }
//   });




tl=gsap.timeline()
tl
.from("#z1 a",{
    duration:2,
    x:-30,
    stagger:0.2,
    opacity:0,
    ease:Expo.easeInOut
})
.from("#welcomel h1",{
    duration:2,
    x:-100,
    // stagger:0.2,
    opacity:0
},"=-1.5")
.from("#z2",{
    duration:3,
    // x:-100,
    // stagger:0.2,
    opacity:0
},"=-1")
.from("#i2",{
    duration:1.5,
    y:70,
    // stagger:0.2,
    opacity:0
},"=-3.8")
.from("#i1",{
    duration:3,
    y:80,
    // stagger:0.2,
    opacity:0
},"=-4")