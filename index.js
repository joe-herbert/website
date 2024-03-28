let currentPage = "landing";

document.addEventListener("DOMContentLoaded", () => {
    particlesJS.load("particles", "assets/particles.json", function () {
        console.log("callback - particles.js config loaded");
    });

    refreshPageDimensions();

    document.getElementById("age").innerHTML = getAge();

    let tintColor = localStorage.getItem("tint");
    if (tintColor) {
        document.querySelector(":root").style.setProperty("--tint", tintColor);
    } else {
        tintColor = "#753ed6";
        localStorage.setItem("tint", tintColor);
        document.querySelector(":root").style.setProperty("--tint", tintColor);
    }
    let tint = document.getElementById("tint");
    tint.value = tintColor;
    tint.addEventListener("change", (event) => {
        document.querySelector(":root").style.setProperty("--tint", event.currentTarget.value);
        localStorage.setItem("tint", event.currentTarget.value);
    });

    document.getElementById("photo").addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            left: pageWidth,
            behavior: "smooth",
        });
        currentPage = "photo";
    });
    document.getElementById("dev").addEventListener("click", () => {
        window.scrollTo({
            top: pageHeight,
            left: 0,
            behavior: "smooth",
        });
        currentPage = "dev";
    });
    document.getElementById("back").addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth",
        });
        currentPage = "landing";
    });

    document.querySelectorAll(".project").forEach((project) => {
        project.querySelector(".imgWrapper").addEventListener("click", () => {
            if (project.classList.contains("active")) {
                project.classList.remove("active");
                project.style.height = "235px";
            } else {
                project.classList.add("active");
                let text = project.querySelector(".projectText");
                let div = document.createElement("div");
                div.innerHTML = text.innerHTML;
                div.style.width = text.getBoundingClientRect().width + "px";
                div.style.padding = "15px 20px 20px 20px";
                div.style.position = "absolute";
                div.style.top = "-200vh";
                div.style.left = "-200vw";
                let body = document.querySelector("body");
                body.appendChild(div);
                project.style.height = 235 + div.getBoundingClientRect().height + "px";
                body.removeChild(div);
            }
        });
    });

    document.querySelectorAll("#gallery img").forEach(() => {});
});

function getAge() {
    var today = new Date();
    var birthDate = new Date("2001-05-10");
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

document.addEventListener("mousemove", (event) => {
    let mouse = document.getElementById("mouse");
    const y = event.pageY;
    const x = event.pageX;
    const scrollLeft = window.pageXOffset !== undefined ? window.pageXOffset : (document.documentElement || document.body.parentNode || document.body).scrollLeft;
    const scrollTop = window.pageYOffset !== undefined ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
    mouse.style.left = x - scrollLeft + "px";
    mouse.style.top = y - scrollTop + "px";
});

document.addEventListener("wheel", checkScrollDirection);

let mouseDiameter = 100;
let pageWidth;
let pageHeight;

function checkScrollDirection(event) {
    if (checkScrollDirectionIsUp(event)) {
        if (mouseDiameter < pageWidth) {
            mouseDiameter += 2;
        }
    } else {
        if (mouseDiameter > 15) {
            mouseDiameter -= 2;
        }
    }
    let mouse = document.getElementById("mouse");
    mouse.style.width = mouseDiameter + "px";
    mouse.style.height = mouseDiameter + "px";
}

function checkScrollDirectionIsUp(event) {
    if (event.wheelDelta) {
        return event.wheelDelta > 0;
    }
    return event.deltaY < 0;
}

window.addEventListener("resize", refreshPageDimensions);

function refreshPageDimensions() {
    pageWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    pageHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

    if (currentPage === "dev") {
        window.scrollTo({
            top: pageHeight,
            left: 0,
            behavior: "smooth",
        });
    } else if (currentPage === "pho") {
        window.scrollTo({
            top: 0,
            left: pageWidth,
            behavior: "smooth",
        });
    }
}
