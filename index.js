let currentPage = "landing";
let tags = [];
let projectsHeight = 735;
let activeProjectHeights = {};
let lastScrollTop = 0;
const defaultTintDark = "#753ed6";
const defaultTintLight = "#955df7";
let lightMode = false;

document.addEventListener("DOMContentLoaded", () => {
    let preferredMode = localStorage.getItem("mode");
    if (preferredMode === "light" || (!preferredMode && window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches)) {
        lightMode = true;
        document.getElementById("lightDarkSwitch").checked = true;
        document.querySelector(":root").classList.add("light");
    } else if (preferredMode === "dark") {
        document.querySelector(":root").classList.add("dark");
    }
    setTimeout(() => {
        document.body.classList.add("loaded");
    }, 50);

    particlesJS.load("particles", `assets/particles${lightMode ? "Light" : ""}.json`, function () {
        console.log("callback - particles.js config loaded");
    });

    refreshPageDimensions();

    document.getElementById("age").innerHTML = getAge();

    let tint = document.getElementById("tint");
    let tintColor = localStorage.getItem("tint");
    const supportsAtProperty = window.getComputedStyle(document.documentElement).getPropertyValue("--tint") !== "";
    if (supportsAtProperty) {
        document.getElementById("tintLabel").dataset.message = `- Click to change the page tint colour\n- Right click to reset\n- Ctrl/Cmd + Click for rainbow mode`;
    }
    if (tintColor === "rainbow" && !supportsAtProperty) {
        tintColor = lightMode ? defaultTintLight : defaultTintDark;
    }
    if (tintColor === "rainbow") {
        document.querySelector(":root").classList.add("rainbow");
        tintColor = lightMode ? defaultTintLight : defaultTintDark;
    } else if (tintColor) {
        if (tintColor === defaultTintDark || tintColor === defaultTintLight) {
            tintColor = lightMode ? defaultTintLight : defaultTintDark;
        }
        document.querySelector(":root").style.setProperty("--tint", tintColor);
        tint.value = tintColor;
    } else {
        tintColor = lightMode ? defaultTintLight : defaultTintDark;
        localStorage.setItem("tint", tintColor);
        document.querySelector(":root").style.setProperty("--tint", tintColor);
        tint.value = tintColor;
    }
    tint.addEventListener("input", (event) => {
        let color = event.currentTarget.value;
        document.querySelectorAll(".usesTint").forEach((el) => {
            el.style.setProperty("--tint", color);
        });
        let root = document.querySelector(":root");
        root.style.setProperty("--tint", color);
        root.classList.remove("rainbow");
        localStorage.setItem("tint", color);
    });
    document.getElementById("tintLabel").addEventListener("click", (event) => {
        if ((event.ctrlKey || event.metaKey) && supportsAtProperty) {
            event.preventDefault();
            document.querySelector(":root").classList.add("rainbow");
            localStorage.setItem("tint", "rainbow");
        }
    });
    document.getElementById("tintLabel").addEventListener("contextmenu", (event) => {
        event.preventDefault();
        let tintColor = lightMode ? defaultTintLight : defaultTintDark;
        localStorage.removeItem("tint", tintColor);
        document.querySelectorAll(".usesTint").forEach((el) => {
            el.style.setProperty("--tint", tintColor);
        });
        let root = document.querySelector(":root");
        root.style.setProperty("--tint", tintColor);
        root.classList.remove("rainbow");
        tint.value = tintColor;
        return false;
    });
    document.getElementById("lightDarkSwitch").addEventListener("change", (event) => {
        let checked = event.currentTarget.checked;
        setTimeout(() => {
            if (checked) {
                lightMode = true;
                localStorage.setItem("mode", "light");
                pJSDom[0].pJS.particles.color.value = "#000000";
                pJSDom[0].pJS.particles.line_linked.color = "#000000";
                pJSDom[0].pJS.fn.particlesRefresh();
                document.querySelector(":root").classList.add("light");
                document.querySelector(":root").classList.remove("dark");
            } else {
                lightMode = false;
                localStorage.setItem("mode", "dark");
                pJSDom[0].pJS.particles.color.value = "#ffffff";
                pJSDom[0].pJS.particles.line_linked.color = "#ffffff";
                pJSDom[0].pJS.fn.particlesRefresh();
                document.querySelector(":root").classList.add("dark");
                document.querySelector(":root").classList.remove("light");
            }
            let tintColor = document.getElementById("tintLabel").value;
            if (!tintColor || tintColor === defaultTintDark || tintColor === defaultTintLight) {
                tintColor = lightMode ? defaultTintLight : defaultTintDark;
                document.querySelector(":root").style.setProperty("--tint", tintColor);
                document.querySelectorAll(".usesTint").forEach((el) => {
                    el.style.setProperty("--tint", tintColor);
                });
                tint.value = tintColor;
            }
        }, 700);
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

    document.querySelectorAll(".profileSection ul:not(.inline) li[data-info]").forEach((li) => {
        li.addEventListener("click", () => {
            let rightInfo = li.closest(".profileSection").querySelector(".rightInfo");
            if (rightInfo.innerHTML === li.dataset.info) {
                if (rightInfo.classList.contains("active")) {
                    hideRightInfo(li, rightInfo);
                } else {
                    showRightInfo(li, rightInfo);
                }
            } else if (li.dataset.info) {
                rightInfo.classList.remove("visible");
                showRightInfo(li, rightInfo);
            } else {
                hideRightInfo(li, rightInfo);
            }
        });
    });

    document.getElementById("projectClose").addEventListener("click", () => {
        document.getElementById("projectInfo").classList.remove("showInfo");
    });

    document.getElementById("allProjectsClose").addEventListener("click", () => {
        document.getElementById("allProjects").classList.remove("showProjects");
    });

    let projectsButton = document.getElementById("projectsButton");
    projectsButton.addEventListener("click", () => {
        document.getElementById("allProjects").classList.add("showProjects");
    });

    //main projects section
    let projectsShown = 0;
    portfolio.forEach((project) => {
        let projectDiv = document.createElement("div");
        projectDiv.classList.add("project");
        if (projectsShown >= 6) {
            projectDiv.classList.add("hide");
        } else {
            projectsShown++;
        }
        let imgWrapper = document.createElement("div");
        imgWrapper.classList.add("imgWrapper");
        imgWrapper.dataset.title = project.title;
        let img = document.createElement("img");
        img.src = project.img;
        if (project.imgStyle) {
            img.style = project.imgStyle;
        }
        imgWrapper.appendChild(img);
        projectDiv.appendChild(imgWrapper);
        let github = document.createElement("a");
        github.classList.add("github");
        github.target = "_blank";
        github.innerHTML = `<i class="fa-brands fa-github"></i>`;
        if (project.github) {
            github.href = project.github;
            projectDiv.appendChild(github);
        }
        let openLink = document.createElement("a");
        openLink.classList.add("openLink");
        openLink.target = "_blank";
        openLink.innerHTML = `<i class="fa-solid fa-arrow-up-right-from-square"></i>`;
        if (project.link) {
            openLink.href = project.link;
            projectDiv.appendChild(openLink);
        }
        let tags = document.createElement("div");
        tags.classList.add("tags");
        project.tags.forEach((tag) => {
            let span = document.createElement("span");
            span.classList.add("tag");
            span.innerHTML = tag;
            tags.appendChild(span);
        });
        projectDiv.appendChild(tags);
        let projectText = document.createElement("div");
        projectText.classList.add("projectText");
        let projectTitle = document.createElement("span");
        projectTitle.classList.add("projectTitle");
        projectTitle.innerHTML = project.title;
        let br = document.createElement("br");
        let description = document.createElement("span");
        description.classList.add("description");
        description.innerHTML = project.description;
        projectText.appendChild(projectTitle);
        projectText.appendChild(br);
        projectText.appendChild(description);
        projectDiv.appendChild(projectText);

        document.getElementById("projects").appendChild(projectDiv);
    });

    //all projects section, in a separate loop so that main images load first - TODO: ideally would optimise to only download each image once and just use it in multiple places
    portfolio.forEach((project) => {
        let allProjectDiv = document.createElement("div");
        allProjectDiv.dataset.title = project.title;
        allProjectDiv.dataset.description = project.description;
        allProjectDiv.dataset.img = project.img;
        if (project.imgStyle) allProjectDiv.dataset.imgStyle = project.imgStyle;
        if (project.github) allProjectDiv.dataset.github = project.github;
        if (project.link) allProjectDiv.dataset.link = project.link;
        allProjectDiv.dataset.tags = JSON.stringify(project.tags);
        allProjectDiv.classList.add("allProject");
        allProjectDiv.style.backgroundImage = `url("${project.icon}")`;
        allProjectDiv.style.backgroundColor = project.iconBackground;
        let allProjectDivWrapper = document.createElement("div");
        allProjectDivWrapper.classList.add("allProjectWrapper");
        allProjectDivWrapper.appendChild(allProjectDiv);
        allProjectDiv.addEventListener("click", (event) => {
            let data = event.currentTarget.dataset;
            let img = document.getElementById("projectImg");
            img.src = data.img;
            if (data.imgStyle) img.style.cssText += data.imgStyle;
            else img.removeAttribute("style");
            if (data.github) document.getElementById("projectGithub").href = data.github;
            else document.getElementById("projectGithub").removeAttribute("href");
            if (data.link) document.getElementById("projectLink").href = data.link;
            else document.getElementById("projectLink").removeAttribute("href");
            let tags = document.getElementById("projectTags");
            tags.innerHTML = "";
            let tagsArray = JSON.parse(data.tags);
            tagsArray.forEach((tag) => {
                let span = document.createElement("span");
                span.classList.add("tag", "usesTint");
                span.innerHTML = tag;
                tags.appendChild(span);
            });
            document.getElementById("projectTitle").innerHTML = data.title;
            document.getElementById("projectDescription").innerHTML = data.description;
            document.getElementById("projectInfo").classList.add("showInfo");
        });
        document.getElementById("allProjectsContainer").appendChild(allProjectDivWrapper);
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
                document.body.appendChild(div);
                let height = div.getBoundingClientRect().height;
                project.style.height = 235 + height + "px";
                document.body.removeChild(div);
            }
            setTimeout(() => {
                projectsHeight = document.getElementById("projects").scrollHeight;
            }, 600);
        });
    });

    document.querySelectorAll("#projects .tag").forEach((tag) => {
        tag.addEventListener("click", (event) => {
            let tagValue = event.currentTarget.innerHTML;
            if (tags.includes(tagValue)) {
                //remove tag
                removeTag(tagValue);
            } else {
                tags.push(tagValue);
                //add tag to list at top
                let topTag = document.createElement("span");
                topTag.classList.add("tag", "invisible", "usesTint");
                topTag.innerHTML = tagValue;
                topTag.addEventListener("click", () => {
                    //remove tag
                    removeTag(tagValue);
                    filterTags();
                });
                document.getElementById("topTags").appendChild(topTag);
                setTimeout(() => {
                    topTag.classList.remove("invisible");
                }, 100);
            }
            filterTags();
        });
    });

    let projects = document.getElementById("projects");
    projectsHeight = projects.scrollHeight;

    document.querySelectorAll("#gallery img").forEach(() => {});

    document.querySelectorAll("a, .nameFirstLetter, button, #colorPicker #tintLabel, #profilePicture, #divider, .project, .project .github, .project .openLink, .tag, .close, #projectGithub, #projectLink, .allProjectWrapper, .liArrow, .switch-toggle").forEach((element) => {
        element.classList.add("usesTint");
        if (tintColor !== "rainbow") {
            element.style.setProperty("--tint", tintColor);
        }
    });

    lastScrollTop = window.pageYOffset !== undefined ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
});

function hideRightInfo(li, rightInfo) {
    li.closest(".profileSection")
        .querySelectorAll("li.active")
        .forEach((li) => {
            li.classList.remove("active");
        });
    rightInfo.classList.remove("visible");
    setTimeout(() => {
        rightInfo.innerHTML = "";
        rightInfo.style.height = "0px"; // li.parentElement.getBoundingClientRect().height + "px";
        rightInfo.classList.remove("active");
    }, 600);
}

function showRightInfo(li, rightInfo) {
    let profileSection = li.closest(".profileSection");
    profileSection.querySelectorAll("li.active").forEach((li) => {
        li.classList.remove("active");
    });
    let tmpRightWrapper = document.createElement("div");
    let width = profileSection.getBoundingClientRect().width;
    if (pageWidth > 900) width = width / 2;
    if (width > 300) width = 300;
    tmpRightWrapper.classList.add("profileSection");
    tmpRightWrapper.style.width = width + "px";
    tmpRightWrapper.style.padding = "10px";
    tmpRightWrapper.style.position = "absolute";
    tmpRightWrapper.style.top = "-100vh";
    tmpRightWrapper.style.left = "-100vw";
    let tmpRight = document.createElement("div");
    tmpRight.innerHTML = li.dataset.info;
    tmpRight.style.textAlign = "right";
    tmpRightWrapper.appendChild(tmpRight);
    document.body.appendChild(tmpRightWrapper);
    let height = tmpRight.getBoundingClientRect().height + 20;
    document.body.removeChild(tmpRightWrapper);
    let tmpUlWrapper = document.createElement("div");
    tmpUlWrapper.classList.add("profileSection");
    tmpUlWrapper.style.position = "absolute";
    tmpUlWrapper.style.top = "-100vh";
    tmpUlWrapper.style.left = "-100vw";
    tmpUlWrapper.style.width = width + "px";
    let tmpUl = document.createElement("ul");
    tmpUl.innerHTML = li.parentElement.innerHTML;
    tmpUlWrapper.appendChild(tmpUl);
    document.body.appendChild(tmpUlWrapper);
    let ulHeight = tmpUlWrapper.getBoundingClientRect().height;
    document.body.removeChild(tmpUlWrapper);
    if (height < ulHeight) height = ulHeight;
    rightInfo.style.height = height + "px";
    li.classList.add("active");
    rightInfo.classList.add("active");
    setTimeout(() => {
        rightInfo.innerHTML = li.dataset.info;
        rightInfo.classList.add("visible");
    }, 600);
}

function removeTag(tagValue) {
    const index = tags.indexOf(tagValue);
    if (index > -1) {
        tags.splice(index, 1);
    }
    let tagWidth = undefined;
    let foundTag = undefined;
    let nextTag = false;
    document.querySelectorAll("#topTags .tag").forEach((tag) => {
        if (tag.innerHTML === tagValue) {
            tagWidth = tag.getBoundingClientRect().width;
            tag.classList.add("invisible");
            foundTag = tag;
            nextTag = true;
        } else if (nextTag) {
            setTimeout(() => {
                foundTag.parentElement.removeChild(foundTag);
                tag.style.transition = "background-color 0.6s, box-shadow 0.6s, opacity 0.6s";
                tag.style.marginLeft = tagWidth + 5 + "px";
                setTimeout(() => {
                    tag.style.transition = "background-color 0.6s, box-shadow 0.6s, opacity 0.6s, margin-left 0.6s";
                    setTimeout(() => {
                        tag.style.marginLeft = 0;
                    }, 50);
                }, 50);
            }, 600);
            nextTag = false;
        }
    });
    if (nextTag) {
        setTimeout(() => {
            foundTag.parentElement.removeChild(foundTag);
        }, 600);
    }
}

function filterTags() {
    document.querySelectorAll(".project").forEach((project) => {
        project.style.opacity = 0;
    });
    setTimeout(() => {
        let projectsShown = 0;
        if (tags.length === 0) {
            document.querySelectorAll(".project").forEach((project) => {
                if (projectsShown < 6) {
                    project.classList.remove("hide");
                    projectsShown++;
                    setTimeout(() => {
                        project.style.opacity = 1;
                    }, 100);
                } else {
                    project.classList.add("hide");
                }
            });
        } else {
            document.querySelectorAll(".project").forEach((project) => {
                //get project tags
                let projectTags = [];
                project.querySelectorAll(".tags .tag").forEach((projectTag) => {
                    projectTags.push(projectTag.innerHTML);
                });
                //search for a matching tag
                let found = false;
                projectTags.forEach((projectTag) => {
                    if (tags.includes(projectTag)) {
                        project.classList.remove("hide");
                        found = true;
                    }
                });
                //if no matching tag then hide
                if (!found || projectsShown >= 6) {
                    project.classList.add("hide");
                } else {
                    project.classList.remove("hide");
                    projectsShown++;
                    setTimeout(() => {
                        project.style.opacity = 1;
                    }, 100);
                }
            });
        }
        let projects = document.getElementById("projects");
        if (projectsHeight < projects.scrollHeight) {
            projects.style.height = projectsHeight + "px";
            setTimeout(() => {
                projects.addEventListener("transitionend", function (e) {
                    projects.removeEventListener("transitionend", arguments.callee);
                    setTimeout(() => {
                        projects.style.height = null;
                    }, 600);
                });
                projects.style.height = projects.scrollHeight + "px";
                projectsHeight = projects.scrollHeight;
            }, 50);
        } else {
            let tmpProjects = document.createElement("div");
            tmpProjects.id = "tmpProjects";
            tmpProjects.classList.add("projectWrapper");
            tmpProjects.innerHTML = projects.innerHTML;
            tmpProjects.style.position = "fixed";
            tmpProjects.style.left = "-100vw";
            tmpProjects.style.top = "-100vh";
            tmpProjects.style.width = "80vw";

            document.body.appendChild(tmpProjects);
            projects.style.height = projectsHeight + "px";
            setTimeout(() => {
                projects.addEventListener("transitionend", function (e) {
                    projects.removeEventListener("transitionend", arguments.callee);
                    setTimeout(() => {
                        projects.style.height = null;
                    }, 600);
                });
                if (tmpProjects.scrollHeight !== projects.scrollHeight) {
                    projects.style.height = tmpProjects.scrollHeight + "px";
                }
                projectsHeight = tmpProjects.scrollHeight;
                document.body.removeChild(tmpProjects);
            }, 50);
        }
    }, 600);
}

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

let scrolling = false;

document.addEventListener("scroll", () => {
    let currentScrollTop = window.pageYOffset !== undefined ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
    if (!scrolling) {
        let height = pageHeight - 5;
        if (lastScrollTop === 0) {
            window.scrollTo({
                top: pageHeight,
                left: 0,
                behavior: "smooth",
            });
            onScrollFinish(pageHeight);
        } else if ((lastScrollTop === height && currentScrollTop < lastScrollTop) || (lastScrollTop >= height && currentScrollTop < height)) {
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: "smooth",
            });
            onScrollFinish(0);
        } else if (currentScrollTop < height) {
            if (currentScrollTop < lastScrollTop) {
                window.scrollTo({
                    top: 0,
                    left: 0,
                    behavior: "smooth",
                });
                onScrollFinish(0);
            } else {
                window.scrollTo({
                    top: pageHeight,
                    left: 0,
                    behavior: "smooth",
                });
                onScrollFinish(pageHeight);
            }
        }
    }
    lastScrollTop = currentScrollTop;
});

function onScrollFinish(target) {
    scrolling = true;
    let position = null;
    const checkIfScrollIsStatic = setInterval(() => {
        if (position === window.scrollY) {
            scrolling = false;
            if (Math.round(target) !== Math.round(lastScrollTop)) {
                let currentScrollTop = window.pageYOffset !== undefined ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
                if (currentScrollTop < lastScrollTop || target === 0) {
                    window.scrollTo({
                        top: 0,
                        left: 0,
                        behavior: "smooth",
                    });
                    onScrollFinish(0);
                } else if (currentScrollTop < pageHeight) {
                    window.scrollTo({
                        top: pageHeight,
                        left: 0,
                        behavior: "smooth",
                    });
                    onScrollFinish(pageHeight);
                }
                lastScrollTop = currentScrollTop;
            }
            clearInterval(checkIfScrollIsStatic);
        }
        position = window.scrollY;
    }, 50);
    /*const checkIfScrollToIsFinished = setInterval(() => {
        if (Math.round(target) === Math.round(lastScrollTop)) {
            scrolling = false;
            clearInterval(checkIfScrollToIsFinished);
        }
    }, 25);*/
}

document.addEventListener("wheel", checkScrollDirection);

let mouseDiameter = 100;
let pageWidth;
let pageHeight;

function checkScrollDirection(event) {
    if (event.shiftKey) {
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
    let currentScrollTop = window.pageYOffset !== undefined ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;

    if (currentPage === "dev" && currentScrollTop < pageHeight) {
        window.scrollTo({
            top: pageHeight,
            left: 0,
            behavior: "smooth",
        });
    } else if (currentPage === "pho") {
        window.scrollTo({
            top: currentScrollTop,
            left: pageWidth,
            behavior: "smooth",
        });
    }
}
