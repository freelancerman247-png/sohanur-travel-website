/* =========================================================
   SOHANUR TRAVEL - SHARED SITE SCRIPT
   Single, non-duplicated implementation of the hamburger menu
   and "More" services dropdown used across every page.
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {
  var hamburger = document.getElementById("hamburger");
  var navMenu = document.getElementById("navMenu");

  if (hamburger && navMenu) {
    hamburger.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      navMenu.classList.toggle("active");
      hamburger.classList.toggle("active");
    });

    navMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navMenu.classList.remove("active");
        hamburger.classList.remove("active");
      });
    });

    document.addEventListener("click", function (e) {
      if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
        navMenu.classList.remove("active");
        hamburger.classList.remove("active");
      }
    });
  }

  document.querySelectorAll(".more-services-btn").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      var parent = btn.closest(".more-services");
      if (parent) {
        parent.classList.toggle("open");
      }
    });
  });

  document.addEventListener("click", function (e) {
    if (!e.target.closest(".more-services")) {
      document.querySelectorAll(".more-services.open").forEach(function (item) {
        item.classList.remove("open");
      });
    }
  });
});
