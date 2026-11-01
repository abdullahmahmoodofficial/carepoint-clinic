/* CarePoint Clinic — shared JS: nav, reveal, counters, FAQ, testimonials, booking form */
(function(){
  "use strict";
  var WA_NUMBER = "923001234567"; // PLACEHOLDER — replace with the clinic's real WhatsApp number
  window.CLINIC_WHATSAPP = WA_NUMBER;

  // Sticky header shadow
  var header = document.getElementById("header");
  function onScroll(){ if(header) header.classList.toggle("scrolled", window.scrollY > 8); }
  window.addEventListener("scroll", onScroll, {passive:true}); onScroll();

  // Mobile nav
  var burger = document.getElementById("hamburger"),
      nav = document.getElementById("nav");
  if(burger && nav){
    burger.addEventListener("click", function(){
      var open = nav.classList.toggle("open");
      burger.classList.toggle("x", open);
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.querySelectorAll("a").forEach(function(a){
      a.addEventListener("click", function(){ nav.classList.remove("open"); burger.classList.remove("x"); });
    });
  }

  // Scroll reveal
  var revealEls = document.querySelectorAll(".reveal");
  if("IntersectionObserver" in window && revealEls.length){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target); } });
    }, {threshold:.12});
    revealEls.forEach(function(el){ io.observe(el); });
  } else {
    revealEls.forEach(function(el){ el.classList.add("in"); });
  }

  // Animated counters
  var counters = document.querySelectorAll(".counter");
  function animateCounter(el){
    var target = parseInt(el.getAttribute("data-target"), 10) || 0,
        dur = 1600, t0 = null;
    function tick(t){
      if(!t0) t0 = t;
      var p = Math.min((t - t0) / dur, 1),
          eased = 1 - Math.pow(1 - p, 3),
          val = Math.round(target * eased);
      el.textContent = val.toLocaleString("en-PK");
      if(p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  if("IntersectionObserver" in window && counters.length){
    var cio = new IntersectionObserver(function(entries){
      entries.forEach(function(e){ if(e.isIntersecting){ animateCounter(e.target); cio.unobserve(e.target); } });
    }, {threshold:.5});
    counters.forEach(function(c){ cio.observe(c); });
  }

  // FAQ accordion
  document.querySelectorAll(".faq-item").forEach(function(item){
    var q = item.querySelector(".faq-q"), a = item.querySelector(".faq-a");
    q.addEventListener("click", function(){
      var isOpen = item.classList.contains("open");
      document.querySelectorAll(".faq-item.open").forEach(function(o){
        o.classList.remove("open"); o.querySelector(".faq-a").style.maxHeight = null;
      });
      if(!isOpen){ item.classList.add("open"); a.style.maxHeight = a.scrollHeight + "px"; }
    });
  });

  // Testimonials slider
  var slides = document.querySelectorAll(".testi"),
      dotsWrap = document.getElementById("testi-dots"),
      idx = 0, timer = null;
  function show(n){
    idx = (n + slides.length) % slides.length;
    slides.forEach(function(s, i){ s.classList.toggle("show", i === idx); });
    if(dotsWrap) dotsWrap.querySelectorAll(".testi-dot").forEach(function(d, i){
      d.classList.toggle("on", i === idx);
    });
  }
  if(slides.length && dotsWrap){
    slides.forEach(function(_, i){
      var d = document.createElement("button");
      d.className = "testi-dot" + (i === 0 ? " on" : "");
      d.setAttribute("aria-label", "Show review " + (i + 1));
      d.addEventListener("click", function(){ show(i); restart(); });
      dotsWrap.appendChild(d);
    });
    function restart(){ clearInterval(timer); timer = setInterval(function(){ show(idx + 1); }, 6000); }
    show(0); restart();
  }

  // Appointment form -> WhatsApp
  var form = document.getElementById("appt-form");
  if(form){
    // Prefill from ?s= (service) and ?d= (doctor)
    try{
      var params = new URLSearchParams(window.location.search),
          s = params.get("s"), d = params.get("d");
      if(s){ var sel = form.querySelector("#f-service"); if(sel){ for(var i=0;i<sel.options.length;i++){ if(sel.options[i].value === s){ sel.selectedIndex = i; break; } } } }
      if(d){ var dsel = form.querySelector("#f-doctor"); if(dsel){ for(var j=0;j<dsel.options.length;j++){ if(dsel.options[j].value === d){ dsel.selectedIndex = j; break; } } } }
    }catch(e){}

    form.addEventListener("submit", function(ev){
      ev.preventDefault();
      var ok = true;
      function check(id, valid){
        var f = document.getElementById(id).closest(".field");
        f.classList.toggle("invalid", !valid);
        if(!valid) ok = false;
      }
      var name = document.getElementById("f-name").value.trim(),
          phone = document.getElementById("f-phone").value.trim(),
          service = document.getElementById("f-service").value,
          doctor = document.getElementById("f-doctor").value,
          date = document.getElementById("f-date").value,
          time = document.getElementById("f-time").value,
          notes = document.getElementById("f-notes").value.trim();
      check("f-name", name.length >= 3);
      check("f-phone", /^[0-9+\-\s]{10,15}$/.test(phone));
      check("f-service", !!service);
      check("f-date", !!date);
      check("f-time", !!time);
      if(!ok) return;

      var serviceLabel = document.getElementById("f-service").selectedOptions[0].textContent,
          doctorLabel = doctor ? document.getElementById("f-doctor").selectedOptions[0].textContent : "No preference";
      var msg = "Assalam-o-Alaikum! I want to book an appointment at CarePoint Clinic.\n\n" +
                "Name: " + name + "\nPhone: " + phone + "\nService: " + serviceLabel +
                "\nDoctor: " + doctorLabel + "\nDate: " + date + "\nTime: " + time +
                (notes ? "\nNotes: " + notes : "");
      window.open("https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(msg), "_blank");

      var done = document.getElementById("appt-done");
      if(done){ done.style.display = "block"; done.scrollIntoView({behavior:"smooth", block:"center"}); }
    });

    // Min date = today
    var dateInput = document.getElementById("f-date");
    if(dateInput){
      var t = new Date(), mm = String(t.getMonth()+1).padStart(2,"0"), dd = String(t.getDate()).padStart(2,"0");
      dateInput.min = t.getFullYear() + "-" + mm + "-" + dd;
    }
  }

  // Footer year
  var yr = document.getElementById("year");
  if(yr) yr.textContent = new Date().getFullYear();
})();
