var mightyStage;
var stage;
var sideBar;
var contentContainer;
var pageLoadingProgress;
var modal;
var modalClose;
var modalHeader;
var modalContainer;
var modalBodyContent;
var modalProgress;
var modalTitle;
var modalIntro;
var indexTitle;
var cachedIndexPosts;
var xhr;

function updatePaddings() {
    if (window.innerWidth > 1130) {
        $('#mobile-footer').hide();
        $('#laptop-footer').show();
        /*
         sideBar.css("left", stage.paddingLeft);
         console.log(sideBar.css("left"));
         contentContainer.css("paddingLeft", sideBar.outerWidth());
         */
        mightyStage.show();
    } else {
        $('#mobile-footer').show();
        $('#laptop-footer').hide();
        /*
         sideBar.css("left", "unset");
         contentContainer.css("paddingLeft", "unset");
         */
        if (window.innerWidth <= 768) {
            if (modalContainer.css("display") === "none") {
                mightyStage.show();
            } else {
                mightyStage.hide();
            }
        } else {
            mightyStage.show();
        }
    }


}

function rJump(rpath) {
    var path = window.location.pathname + "#" + rpath;
    window.history.pushState(null, "", path);
    window.location.href = "#" + rpath;
}

function currPath() {
    if (window.location.hash.startsWith("#/")) {
        return window.location.hash.substring(1);
    } else {
        return "/";
    }
}

function onHashChanged() {
    // console.log("onHashChanged");
    if (currPath() === "/") {
        document.title = indexTitle;
        hideModal();
    }
    else {
        //document.title = "Route: " + currPath();
        onModalLoad();
    }
}

function onModalLoad() {
    modalBodyContent.hide();
    modalProgress.show();
    // console.log(currPath());
    if (xhr !== undefined) {
        xhr.abort();
    }
    if (currPath().startsWith("/!post")) {
        resetModal();
        // that's a post
        showModal(function () {
            var basePath = window.location.pathname.substring(0, window.location.pathname.lastIndexOf("/")) + currPath().replace(/(\/\!post)(.*)/g, "$2");
            xhr = $.ajax({
                url: basePath + "/index.html",
                method: "GET"
            });
            xhr.done(function (data) {
                modalBodyContent.html(data);
                modalBodyContent.show();
                modalProgress.hide();
                document.title = $("#jnl_patrial_head_title").text();
                modalTitle.text($("#jnl_patrial_title").text());
                var featuredImg = $("#jnl_patrial_featured_image").text();
                if (featuredImg !== "") {
                    // console.log(basePath + "/" + featuredImg);
                    modalHeader.css("background-image", "url('" + basePath + "/" + featuredImg + "')");
                }
                var intro = $("#jnl_patrial_intro").text();
                if (intro !== undefined && intro !== "") {
                    modalIntro.text(intro);
                    modalIntro.show();
                } else {
                    modalIntro.hide();
                }
                // console.log(modalBodyContent.children('img'));
            });
            xhr.fail(function (xhr, textStatus, errorThrown) {
                if (textStatus !== "abort") {
                    modalBodyContent.html('<h3 align="center">出错了</h3><p align="center">为什么会这样呢？<br>' + errorThrown + '</p><br>');
                    modalBodyContent.show();
                    modalProgress.hide();
                }
            });
        });
    } else if (currPath().startsWith("/!page")) {
        resetModal();
        // that's a page
        showModal(function () {
            var basePath = window.location.pathname.substring(0, window.location.pathname.lastIndexOf("/")) + currPath().replace(/(\/\!page)(.*)/g, "$2");
            xhr = $.ajax({
                url: basePath + "/index.html",
                method: "GET"
            });
            xhr.done(function (data) {
                modalBodyContent.html(data);
                modalBodyContent.show();
                modalProgress.hide();
                document.title = $("#jnl_patrial_head_title").text();
                modalTitle.text($("#jnl_patrial_title").text());
                // console.log(basePath + $("#jnl_patrial_featured_image").text());
                modalHeader.css("background-image", "url('" + basePath + "/" + $("#jnl_patrial_featured_image").text() + "')");
                var intro = $("#jnl_patrial_intro").text();
                if (intro !== undefined && intro !== "") {
                    modalIntro.text(intro);
                    modalIntro.show();
                } else {
                    modalIntro.hide();
                }
            });
            xhr.fail(function (xhr, textStatus, errorThrown) {
                if (textStatus !== "abort") {
                    modalBodyContent.html('<h3 align="center">出错了</h3><p align="center">为什么会这样呢？<br>' + errorThrown + '</p><br>');
                    modalBodyContent.show();
                    modalProgress.hide();
                }
            });
        });
    } else if (currPath().startsWith("/!index")) {
        // that's a page of the index page
        if (cachedIndexPosts === undefined) {
            cachedIndexPosts = dynamicLoadedPostList.html();
        }
        hideModal();
        var basePath = currPath().replace(/(\/\!index)(.*)/g, "$2");
        if (basePath === "/" || basePath === "/1") {
            rJump("/");
            dynamicLoadedPostList.html(cachedIndexPosts);
        } else {
            pageLoadingProgress.show();
            dynamicLoadedPostList.css("opacity", 0.5);
            basePath = window.location.pathname.substring(0, window.location.pathname.lastIndexOf("/")) + basePath;
            xhr = $.ajax({
                url: basePath + "/index.html",
                method: "GET"
            });
            xhr.done(function (data) {
                dynamicLoadedPostList.html(data);
            });
            xhr.fail(function (xhr, textStatus, errorThrown) {
                if (textStatus !== "abort") {
                    $.notify({
                        // options
                        message: '載入資源時發生錯誤'
                    }, {
                        // settings
                        type: 'danger'
                    });
                }
            });
            xhr.always(function () {
                dynamicLoadedPostList.css("opacity", 1);
                pageLoadingProgress.fadeOut(800);
            });
        }
    } else {
        // what r u doing u naughty boy?
        hideModal();
    }
}

function showModal(cb) {
    if (window.innerWidth <= 768) {
        mightyStage.hide();
    } else {
        mightyStage.show();
    }
    $(window).scrollTop(0);
    modalContainer.fadeIn(600, function () {
        if (window.innerWidth <= 768) {
            mightyStage.hide();
        }
        cb.call();
    });
    mightyStage.css("overflow-y", "hidden");
}

function resetModal() {
    modalBodyContent.html("");
    modalTitle.text("");
    modalIntro.text("");
    modalHeader.css("background-image", "");
}

function hideModal() {
    if (window.innerWidth <= 768) {
        mightyStage.show();
    }
    modalContainer.addClass("modal-transition-patch");
    if (window.innerWidth <= 768) {
        resetModal();
    }
    modalContainer.fadeOut(600, function () {
        resetModal();
        modalContainer.removeClass("modal-transition-patch");
    });
    mightyStage.css("overflow-y", "");
}

$(document).ready(function () {
    indexTitle = document.title;
    mightyStage = $('#mighty-stage');
    stage = $('#stage');
    sideBar = $('#side-bar');
    dynamicLoadedPostList = $('#dynamic-loaded-post-list');
    pageLoadingProgress = $('#page-loading-progress');
    modal = $('#modal');
    modalClose = $('#modal-close');
    modalHeader = $('#modal-header');
    modalContainer = $('#modal-container');
    modalBodyContent = $('#modal-body-content');
    modalProgress = $('#modal-progress');
    modalTitle = $('#modal-title');
    modalIntro = $('#modal-intro');
    contentContainer = $('#content-container');
    updatePaddings();
    modal.click(function (evt) {
        evt.stopPropagation();
    });
    modalClose.click(function (evt) {
        rJump("/");
    });
    modalContainer.click(function (evt) {
        //hideModal();
        rJump("/");
    });
    $(window).resize(function () {
        updatePaddings();
    });
    window.onpopstate = function (e) {
        // console.log(e)
        onHashChanged();
    };
    onHashChanged();
    pageLoadingProgress.fadeOut(800);
});
