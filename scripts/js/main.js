
const anchors = ["home", "hikmah1", "undangan", "about", "storyline", "hikmah2", /*"aza",*/ "info", "rsvp"]

const animationRegister = (function() {

  let nodeList = []

  return {
    register: function(elem, animationName) {
      nodeList.push({
        node: elem,
        animationName: animationName
      })
    },
    clear: function() {
      while(nodeList.length) {
        let { node, animationName } = nodeList.pop()
        node.classList.remove('animated', animationName)
      }
    }
  }
}) ()

function handleOnLeave(origin, destination, direction)
{
  // --- background change ---
  let divBg = document.getElementById('bg-placeholder')
  let divBg2 = document.getElementById('bg-placeholder2')

  console.log(origin.index + ' ' + destination.index + ' ' + direction)

  if(origin.index < 3 && destination.index >= 3)
  {
    divBg.classList.add('bg-two')
    divBg2.classList.add('bg2-two')
  }

  if(origin.index >= 3 && destination.index < 3) {
    divBg.classList.remove('bg-two')
    divBg2.classList.remove('bg2-two')
  }

  if(destination.anchor == 'rsvp') {
    divBg2.classList.add('bg2-three')
  }

  if(origin.anchor == 'rsvp') {
    divBg2.classList.remove('bg2-three')
  }

  // --- section 0 (home) ---

  if(origin.index == 0) {
    let img = document.getElementById('img-za')
    if( img.classList.contains('img-seen') )
      img.classList.remove('img-seen')
  }

  // clear previous animation registered with animateCSS
  // (so that it can reload when the section is re-visited)
  animationRegister.clear()
}

function handleAfterLoad(origin, destination, direction)
{

  if(destination.index == 0) {
    let img = document.getElementById('img-za')
    img.classList.add('img-seen')
  }

  if(destination.anchor == 'hikmah1') {
    animateCSS('#arrum', 'zoomIn')
  }

  if(destination.anchor == 'undangan') {
    let delay = 0
    let animations = ['fadeInDown', 'fadeInUp', 'flipInX', 'flipInX', 'fadeInUp']
    document.querySelectorAll('[data-anchor=undangan] p')
    .forEach(function (node, i) {
      node.style.animationDelay = delay+'ms'
      delay += 300
      animateCSSon(node, animations[i])
    })
  }

  if(destination.anchor == 'storyline') {
    fullpage_api.reBuild()
  }
}

function animateCSS(selector, animationName, callback) {
  const node = document.querySelector(selector)
  return animateCSSon(node, animationName, callback)
}

function animateCSSon(node, animationName, callback) {
    node.classList.add('animated', animationName)
    animationRegister.register(node, animationName)
}

// countdown section
const weddingTime = 1561251600;
let now = (new Date()).getTime()

let timerId = countdown(function (ts) {
  // console.log(ts)
  const units = ['weeks', 'days', 'hours', 'minutes', 'seconds']
  const labels = ['minggu', 'hari', 'jam', 'menit', 'detik']

  function duaDigit(chr) {
      if(chr.toString().length < 2)
        return "0" + chr.toString();
      else
        return chr.toString()
  }

  for(let i = 0;i < units.length;++i)
  {
      document.getElementById(units[i]).innerHTML = duaDigit(ts[units[i]])
  }

}, weddingTime*1000, countdown.WEEKS | countdown.DAYS | countdown.HOURS | countdown.MINUTES | countdown.SECONDS)

// Listener for form radio change
function handleAttendanceChange(e) {
    var list = document.querySelectorAll('.will-attend input')
    if(document.getElementById('rsvp-1-1').checked) {
      for(var i = 0, el = list[i]; i < list.length ;++i, el=list[i])
      {
        if(el.hasAttribute('disabled'))
          el.removeAttribute('disabled')
      }
    } else {
      for(var i = 0, el = list[i]; i < list.length ;++i, el=list[i])
      {
        el.setAttribute('disabled', '')
      }
    }
}

document.getElementById('rsvp-1-1').addEventListener('change', handleAttendanceChange)
document.getElementById('rsvp-1-2').addEventListener('change', handleAttendanceChange)

fetch("https://script.googleusercontent.com/macros/echo?user_content_key=MwLli6zPyZEGyqRgC2mJ38lwuDPDdIleyfFy8d0fVMJwIuLynFQurP_0vxYurBznKRS-5DNdlo9IZAalX7Hqc2Q7_cJegkvtm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnGX_TbfUPh7CIEGIkXjx2EGYGh85oFwCNt0-m3bLPlfXzYFTN7hdY6shPuo-3l_PPsTvy1m0tLyP&lib=MB8u0sxb66PMk1tHZwDvMJYrxwHvlKT-q")
.then(resp => resp.json())
.then(data => {
  var div = document.getElementById('guestbook')
  var messagesDiv = div.getElementsByClassName('container')[0]

  var text = ""
  for(var i in data) {
    if(i == 1) continue;
    text += "<h5>" + data[i].nama
    if(data[i].akanHadir) {
      text += " <span class='badge badge-success'>✓ Attending</span>"
    }
    text += "</h5>\n"
    text += "<p>" + data[i].words + "</p><hr/>\n"
  }

  console.log(messagesDiv)
  messagesDiv.innerHTML = text
  fullpage_api.reBuild()
  // div.style.display = 'block'
})
// document.forms[0].elements
// document.getElementById('img-za').classList.add('img-seen');
// setTimeout(() => {document.getElementById('img-za').classList.add('img-seen');}, 1000)

// fetch("http://worldtimeapi.org/api/ip", {mode: 'no-cors'}).then(resp => resp.json())
//   .then(obj => obj.unixtime)
//   .then(
//     function (now) {
//       console.log(now)
//
//       let start = now
//       let timer = setInterval(function() {
//         let ts = countdown(start*1000, weddingTime*1000, ~countdown.MILLISECONDS)
//         --start
//         document.getElementById("timer").innerHTML = ts.toHTML()
//       }, 1000)
//   })
//   .catch(function(err) {
//     console.warn(err)
//   })
