// The website's few moving parts: light/dark switch, the phone menu, things coming into view, and the 3D tilt.
// No tracking of any kind. Motion stays still for anyone whose phone asks for less of it.
(function () {
  var root = document.documentElement;
  var still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  // Light or dark: follows the phone until the visitor picks one here.
  var toggle = document.querySelector(".theme-toggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var dark = root.getAttribute("data-theme")
        ? root.getAttribute("data-theme") === "dark"
        : window.matchMedia("(prefers-color-scheme: dark)").matches;
      var next = dark ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try {
        localStorage.setItem("theme", next);
      } catch (e) {}
    });
  }

  // The header: glass once the page scrolls, and the menu on small screens.
  var nav = document.querySelector(".nav");
  var menu = document.querySelector(".menu-btn");
  if (nav) {
    var onScroll = function () {
      nav.classList.toggle("scrolled", window.scrollY > 10);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }
  if (nav && menu) {
    menu.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      menu.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.querySelectorAll(".nav-links a").forEach(function (a) {
      a.addEventListener("click", function () {
        nav.classList.remove("open");
        menu.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Things come into view as the page scrolls to them.
  var reveals = document.querySelectorAll(".reveal, .mini-chart");
  if ("IntersectionObserver" in window && !still) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    reveals.forEach(function (el) {
      io.observe(el);
    });
  } else {
    reveals.forEach(function (el) {
      el.classList.add("in");
    });
  }

  if (still) return;

  // The hero phones lean towards the pointer. On a phone there is none: they lean as the phone is tilted, and
  // until it is (or where the browser gives no tilt), they turn slowly on their own.
  var stage = document.querySelector(".stage");
  if (stage) {
    var tx = 0,
      ty = 0,
      cx = 0,
      cy = 0,
      raf = 0;
    var step = function () {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      stage.style.setProperty("--ry", (cx * 14).toFixed(2) + "deg");
      stage.style.setProperty("--rx", (-cy * 9).toFixed(2) + "deg");
      raf = Math.abs(tx - cx) + Math.abs(ty - cy) > 0.001 ? requestAnimationFrame(step) : 0;
    };
    var lean = function (x, y) {
      tx = Math.max(-0.6, Math.min(0.6, x));
      ty = Math.max(-0.6, Math.min(0.6, y));
      if (!raf) raf = requestAnimationFrame(step);
    };
    if (finePointer) {
      window.addEventListener(
        "pointermove",
        function (e) {
          lean(e.clientX / window.innerWidth - 0.5, e.clientY / window.innerHeight - 0.5);
        },
        { passive: true }
      );
    } else {
      stage.classList.add("sway");
      window.addEventListener(
        "deviceorientation",
        function (e) {
          if (e.gamma == null || e.beta == null) return;
          stage.classList.remove("sway");
          lean(e.gamma / 30, (e.beta - 50) / 45); // side to side, and forward and back from how a phone is usually held
        },
        { passive: true }
      );
    }
  }

  // Cards tilt a little under the pointer.
  if (finePointer) {
    document.querySelectorAll("[data-tilt]").forEach(function (card) {
      card.addEventListener("pointermove", function (e) {
        var r = card.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = "perspective(900px) rotateX(" + (-y * 6).toFixed(2) + "deg) rotateY(" + (x * 8).toFixed(2) + "deg) translateY(-4px)";
      });
      card.addEventListener("pointerleave", function () {
        card.style.transform = "";
      });
    });
  }

  // Phone pairs open up as they scroll into the middle of the screen.
  var pairs = document.querySelectorAll(".spot-media");
  if (pairs.length) {
    var ticking = false;
    var update = function () {
      ticking = false;
      var vh = window.innerHeight;
      pairs.forEach(function (el) {
        var r = el.getBoundingClientRect();
        var mid = r.top + r.height / 2;
        var p = Math.min(1, Math.max(0, Math.abs(mid - vh / 2) / (vh * 0.8)));
        el.style.setProperty("--p", p.toFixed(3));
      });
    };
    update();
    window.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(update);
        }
      },
      { passive: true }
    );
  }
})();
