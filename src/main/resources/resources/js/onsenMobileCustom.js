var multiPurposeTemplateCount = 1;
var isDisabled = false;

document.addEventListener('prechange', function (event) {
    //handle auto scolling for inner tab
    var container = $(event.tabItem).closest('.tabbar--top');
    if (container.length) {
        // Get the active tab element
        var activeTab = $(event.tabItem)[0];
        var activeTabWidth = $(event.tabItem).outerWidth();
        var leftOffset = 0;
        
        var sibling = activeTab.previousElementSibling;
        while (sibling) {
            leftOffset += sibling.offsetWidth;
            sibling = sibling.previousElementSibling;
        }
        var scrollOffset = leftOffset - (container.width() / 2) + (activeTabWidth / 2);
        $(container).animate({scrollLeft: scrollOffset}, 250);
    }
    
    // Get the title from the tab element and set it as the page title
    if (event.tabItem && event.tabItem.hasAttribute('label')) {
        document.querySelector('ons-toolbar .toolbar__title').innerHTML = event.tabItem.getAttribute('label');
    }
    
    // Check if the event has a tabItem and it has an id attribute
    if (event.tabItem && event.tabItem.hasAttribute('id')) {
        let targetTemplateId = null;
        var templateId = event.tabItem.getAttribute('id');
        // Check if the tab includes category. If it does, it means the tab contains inner tab, so no need to set the templateId
        if (!event.tabItem.getAttribute('id').includes("category")) {
            targetTemplateId = templateId;
        }
        // If the content is empty or the list exists, then reload the page
        if (!$("ons-page#" + templateId + ' .page__content > #content').length || $("ons-page#" + templateId + ' .page__content > #content .datalist-body-content').length) {
            var href = event.tabItem.getAttribute('href');
            // Find inner tab href
            if (templateId.includes("category")) {
                href = $("ons-page#" + templateId + ' .page__content ons-tab.active.tabbar--top__item').attr('href');
            }
            // If href is not null and matches current URL, make Ajax call
            if (href !== null) {
                if (AjaxComponent.isCurrentUserviewUrl(href) || window.name === "preview-iframe") {
                    OnsenMobileAjaxComponent.call($("#content.page_content"), href, "GET", null, null, null, null, targetTemplateId);
                }
            }
        } 
    }
});

document.addEventListener('init', function (event) {
    var page = event.target;
    //load menu inbox content
    var inboxButton = document.querySelector('#inbox-button');
    if (inboxButton) {
        inboxButton.onclick = function () {
            var inboxLink = $(this)[0].getAttribute('href');
            var title = $(this)[0].getAttribute('title');
            if (AjaxComponent.isCurrentUserviewUrl(inboxLink)) {
                // Push a new page using OnsenMobileAjaxComponent
                OnsenMobileAjaxComponent.pushPage(true, 'template_inbox', title, 'slide', function (template) {
                    // Call to load the content
                    OnsenMobileAjaxComponent.call($("#content.page_content"), inboxLink, "GET", null, null, null, null, template);
                });
            }
        };
    }
    
    //load menu content
    window.fn.loadMenu = function (element) {
        var menu = document.getElementById('menu');
        var href = $(element).find('a')[0].getAttribute('href');
        var label = $(element).find('span')[0].textContent;
        if (href === null) {
            $(element).find('a')[0].click();
        } else {
            if (AjaxComponent.isCurrentUserviewUrl(href) || window.name === "preview-iframe") {
                // Push a new page using OnsenMobileAjaxComponent
                OnsenMobileAjaxComponent.pushPage(true, 'template_navi-page', label, 'slide', function (template) {
                    // Call to load the content
                    OnsenMobileAjaxComponent.call($("#content.page_content"), href, "GET", null, null, null, null, template);
                });
            }
        }
        menu.close();
    };
    
    //load menu profile content
    window.fn.loadProfile = function (element) {
        var menu = document.getElementById('menu');
        var href = element.getAttribute('href');
        var label = element.getAttribute('title');
        if (AjaxComponent.isCurrentUserviewUrl(href)) {
            // Push a new page using OnsenMobileAjaxComponent
            OnsenMobileAjaxComponent.pushPage(true, 'template_profile', label, 'slide', function (template) {
                // Call to load the content
                OnsenMobileAjaxComponent.call($("#content.page_content"), href, "GET", null, null, null, null, template);
            });
        }
        menu.close();
    };
    
    //load for login buttons
    window.fn.load = function (link) {
        var menu = document.getElementById('menu');
        OnsenMobileAjaxComponent.call($("#content.page_content"), link, "GET", null, null, null, null, null);
        menu.close();
    };
    
    //Add pull to refresh when a new page loaded
    onsenMobileTheme.addPullHookEvent();
    
    // Set title based on tab title
    var tabTitle = $('#onsenTabbar > .tabbar > ons-tab.active .tabbar__label').text();
    if (tabTitle !== null && tabTitle !== undefined) {
        var tabTitleEle = page.querySelector('ons-toolbar .toolbar__title');
        if (tabTitleEle) {
            tabTitleEle.innerHTML = tabTitle;
        }
    }
    
    // Set title based on page title
    if (page.data !== undefined && page.data.title !== undefined) {
        if ($('ons-toolbar .toolbar__title').length) {
            page.querySelector('ons-toolbar .toolbar__title').innerHTML = page.data.title;
        }
    }
    $(document).on('click', 'ons-back-button', function (event) {
        setTimeout(function () {
            $(window).trigger('resize'); //in order for datalist to render in correct viewport
        }, 5);
    });
        
    //calculation for blockui size and postion
    $(document).on('click', '.ps_progress_container', function (event) {
        if (!isDisabled) {
            isDisabled = true;

            var parent = $('ons-page.page[shown]:not(.page--wrapper)[id*="template"] .page__content #content');
            var element = $(this).prev('.blockui');
            
            //calculate the top value 
            var parentOffset = parent.offset();
            var elementOffset = element.offset();
            
            //calculate the left value
            var widthRelativeToParent = elementOffset.left - parentOffset.left;
            var heightRelativeToParent = elementOffset.top - parentOffset.top;

            var leftValue;
            var rightValue;
            if (!$('body').hasClass('rtl')) {
                leftValue = '-' + widthRelativeToParent + 'px';
                rightValue = '0px';
            } else {
                leftValue = '0px';
                rightValue = widthRelativeToParent;
            }
            
            element.css({
                'left': leftValue,
                'right': rightValue,
                'top': '-' + heightRelativeToParent + 'px',
                'height': parent.outerHeight(true) + 'px',
                'width': parent.outerWidth(true) + 'px'
            });

            setTimeout(function () {
                isDisabled = false;
            }, 500); // Enable after 0.5 second
        }
    });

    $(document).on('click', '.blockui', function (event) {
        $(this).css({
            'left': '',
            'right': '',
            'top': '',
            'height': '',
            'width': ''
        });
    });
});

window.fn = {};

//Handle side menu open
window.fn.open = function() {
  var menu = document.getElementById('menu');
  menu.open();
};

// Modify some of the methods from AjaxUniversalTheme to make it work on onsenMobileTheme
onsenMobileTheme = {
    callback: function (data, template) {
        if (!window.name === "preview-iframe") {
            AjaxComponent.unbindEvents(); //remove all binded evernts
            AjaxUniversalTheme.clearDynamicElement();
            AjaxUniversalTheme.updateLoginUrl();
        }
        
        if (data.indexOf("ajaxtheme_loading_container") !== -1) {
            var html = $(data);
            var title = $(html).find("#ajaxtheme_loading_title");
            var menus = $(html).find("#ajaxtheme_loading_menus");
            var content = $(html).find("#ajaxtheme_loading_content");
            var homeBanner = $(html).find("#ajaxtheme_homebanner_content");
            
            onsenMobileTheme.renderAjaxContent(menus, content, title, homeBanner, template);

            if (window['Analyzer'] !== undefined && $(html).find("#ajaxAnalyzerJson").length > 0) {
                Analyzer.clearAnalyzer();
                var analyzerJson = $(html).find("#ajaxAnalyzerJson").val();
                var analyzer = JSON.parse(analyzerJson);
                Analyzer.initAnalyzer(analyzer);
            }
        } else if (data.indexOf("<html") !== -1 && data.indexOf("</html>") !== -1) {
            //something wrong and caused the full html loaded
            var html = $(data);
            var title = $(html).find("title");
            var menus = $(html).find("#category-container").wrap("<div>");
            var content = $(html).find("#content main");
            
            onsenMobileTheme.renderAjaxContent(menus, content, title, null, template);

            if (window['Analyzer'] !== undefined && $(html).find("#analyzerJson").length > 0) {
                Analyzer.clearAnalyzer();
                var analyzerJson = $(html).find("#analyzerJson").val();
                var analyzer = JSON.parse(analyzerJson);
                Analyzer.initAnalyzer(analyzer);
            }
        }
        themePageInit();
    },
    
    // Make list action to stick on the bottom of the page
    moveListActiontoBottom: function (template) {
        setTimeout(function () {
            var firstActionsElement = $('ons-page.page#' + template + ' .page__content .dataList .actions').eq(0)[0];
            if (firstActionsElement && firstActionsElement.offsetHeight !== undefined) {
                var offsetHeight = firstActionsElement.offsetHeight;
                $('ons-page.page[shown] .table-wrapper').css('margin-bottom', offsetHeight + 'px');
            }
        }, 5);
    },
    
    // Add pull to refresh event
    addPullHookEvent: function (template) {
        var pullHook;
        if (template) {
            pullHook = document.querySelector('#pull-hook-' + template);
        } else {
            pullHook = document.querySelector('#pull-hook');
        }

        if (pullHook) {
            pullHook.setAttribute('href', window.location.href);
            pullHook.setAttribute('threshold-height', '-1px');
            pullHook.setAttribute('height', '100px');
            pullHook.addEventListener('changestate', function (event) {
                var message = '';

                switch (event.state) {
                    case 'initial':
                        message = initialMessage;
                        break;
                    case 'preaction':
                        message = releaseMessage;
                        break;
                    case 'action':
                        message = loadingMessage;
                        break;
                }

                pullHook.innerHTML = message;
            });

            pullHook.onAction = function (done) {
                let href = pullHook.getAttribute('href');
                OnsenMobileAjaxComponent.call($("#content.page_content"), href, "GET", null, null, null, null, OnsenMobileAjaxComponent.getTopTemplate());
                setTimeout(done, 1500);
            };
        }
    },
    
    renderAjaxContent: function (menus, content, title, homeBanner, template) {
        //update body id according to url
        var currentPath = window.location.pathname;
        
        var menuId = currentPath.substring(currentPath.lastIndexOf("/") + 1);
        $("body").attr("id", menuId);

        $("title").html($(title).html());
        if (!window.name === "preview-iframe") {
             AjaxUniversalTheme.updateMenus(menus);
        }
        var target;
        //Check if template exist
        if (template !== null && template !== undefined) {
            // Render content at the specific template
            target = $('ons-page.page#' + template + ' .page__content');
        } else {
            //render content at current active page
            target = $('ons-page.page[shown]:not(.page--wrapper)[id*="template"] .page__content');
            template = $('ons-page.page[shown]:not(.page--wrapper)[id*="template"]').attr('id');
        }
        $(target).html('<ons-pull-hook id="pull-hook-' + template + '">Pull to refresh</ons-pull-hook><div id="content" class="page_content"><main>' + $(content).html() + '</main></div>');
        $(target).attr("aria-live", "polite");

        $(".home_banner").remove();
        $("body").removeClass("has_home_banner");
        if ($(homeBanner).find(".home_banner").length > 0) {
            $("#page #main").before($(homeBanner).find(".home_banner"));
            $("body").addClass("has_home_banner");
        }

        AjaxComponent.overrideFormEvent($("#category-container"));
        OnsenMobileAjaxComponent.initContent($(target));
        AjaxMenusCount.init();
        
        //disable buttons in preview
        if (window.name === "preview-iframe") {
            $(target).find('button[class*=button], input[class*=button]').prop('disabled', true);
        }
        
        // Check if any canvas elements were found. If found, add an event listener to disable pull-to-refresh when drawing.
        var $canvasElements = $(target).find('canvas');
        if ($canvasElements.length > 0) {
            let pullHook = $(target).find('ons-pull-hook');
            let swipeableTab = false;
            $canvasElements.each(function () {
                $(this).on('touchstart mousedown', function (e) {
                    pullHook.prop('disabled', true);
                    var tabbar = $('ons-tabbar[position="bottom"]');
                    if (tabbar.attr('swipeable') !== undefined) {
                        swipeableTab = true;
                    }
                    $('ons-tabbar').removeAttr('swipeable');
                });
                $(this).on('touchend mouseup', function (e) {
                    pullHook.prop('disabled', false);
                    if (swipeableTab) {
                        $('ons-tabbar').attr('swipeable', '');
                    } else {
                        $('ons-tabbar[position="top"]').attr('swipeable', '');
                    }
                });
            });
        }

        if ($(target).find(".c-overflow").length > 0) {
            AjaxUniversalTheme.scrollBar(".c-overflow", "y");
        }

        $("html, body").animate({
            scrollTop: 0
        }, 0);

        setTimeout(function () {
            $(window).trigger('resize'); //inorder for datalist to render in correct viewport
        }, 5);
        onsenMobileTheme.moveListActiontoBottom(template);
        onsenMobileTheme.addPullHookEvent(template);
        
        //check if scroll to element exist
        var currentURL = window.location.href;
        if (currentURL.indexOf('#') !== -1) {
            // Extract the last part of the URL path
            var pathParts = currentURL.split('/');
            var lastPath = pathParts[pathParts.length - 1];

            // Check if the last part of the URL path contains #
            if (lastPath.indexOf('#') !== -1) {
                // Split the last part of the URL path at #
                var parts = lastPath.split('#');
                // Extract the value after #
                var valueAfterHash = parts[1];
                setTimeout(function () {
                    //wait for the page fully loaded then scroll to element
                    OnsenMobileAjaxComponent.scrollToElement('#' + valueAfterHash);
                }, 1000);
            }
        }
    }
};

// Modify some of the methods in AjaxComponent to make it work on OnsenMobileAjaxComponent
OnsenMobileAjaxComponent = {
    initAjax : function(element) {
        AjaxComponent.unbindEvents();
        $(element).find("[data-ajax-component], [data-ajax-component][data-events-triggering], [data-ajax-component][data-events-listening]").each(function() {
            OnsenMobileAjaxComponent.initContent($(this));
        });
        
        setTimeout(function(){
            AjaxComponent.triggerPageLoadedEvent();
            AjaxComponent.triggerEvents($("#content.page_content"), window.location.href, "get");
        }, 2);
        
        setTimeout(function(){
            $(window).trigger('resize'); //inorder for datalist to render in correct viewport
        }, 5);
    },
    
    /*
     * Override the behaviour of an AJAX supported component
     */
    initContent : function(element) {
        OnsenMobileAjaxComponent.overrideLinkEvent(element);
        setTimeout(function(){
            OnsenMobileAjaxComponent.overrideButtonEvent(element);
            OnsenMobileAjaxComponent.overrideDatalistButtonEvent(element);
            OnsenMobileAjaxComponent.overrideFormEvent(element);
            OnsenMobileAjaxComponent.initEventsListening(element);

            if (window["AdminBar"] !== undefined) {
                AdminBar.initQuickEditMode();
            }
        },1);
    },
    
    /*
     * Override the link behaviour
     */
    overrideLinkEvent: function (element) {
        setTimeout(function () {
            $(element).on("click", "a[href]:not(.off_ajax)", function (e) {
                var a = $(this);
                var href = $(a).attr("href");
                var target = $(a).attr("target");
                var onclick = $(a).attr("onclick");
                if ((typeof PwaUtil === 'undefined' || PwaUtil.isOnline !== false) && onclick === undefined && AjaxComponent.isCurrentUserviewUrl(href) && !AjaxComponent.isDatalistExportLink(a)
                        && (target === null || target === undefined || target === "" || target === "_top" || target === "_parent" || target === "_self")) {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    if (target === "_top") {
                        window.top.location = href;
                    } else if (target === "_parent") {
                        window.parent.location = href;
                    } else {
                        let template = "template_multiPurposeTemplate";
                        if (href.charAt(0) === '#') {
                            OnsenMobileAjaxComponent.scrollToElement(href);
                        } else if (href.charAt(0) === '?') {
                            OnsenMobileAjaxComponent.call($(a), href, "GET", null);
                        } else {
                            OnsenMobileAjaxComponent.pushPage(true, template, null, null, function (template) {
                                OnsenMobileAjaxComponent.call($(a), href, "GET", null, null, null, null, template);
                            });
                        }
                        return false;
                    }
                }
                return true;
            });
        }, 1);
    },
    
    scrollToElement: function(href){
        if (href === '#') {
            // Scroll to the top of the page
            history.pushState(null, '', href);
            var parent = $('ons-page.page[shown]:not(.page--wrapper)[id*="template"] .page__content').animate({ scrollTop: 0 }, 'slow');
            parent.animate({ scrollTop: 0 }, 'smooth');
        } else if (href.charAt(0) === '#') {
            // Scroll to the target element
            history.pushState(null, '', href);
            var target = document.querySelector(href);
            console.log(target);
            if (target) {
                target.scrollIntoView({behavior: 'smooth'});
            }
        }
    },
    
    /*
     * Override the datalist button behaviour
     */
    overrideDatalistButtonEvent : function(element) {
        $(element).find(".dataList button[data-href]:not(.off_ajax)").each(function(){
            var btn = $(this);
            var url = $(btn).data("href");
            var target = $(btn).data("target");
            var hrefParam = $(btn).data("hrefparam");
            if (AjaxComponent.isCurrentUserviewUrl(url) 
                    && (target === null || target === undefined || target === "" || target === "_top" || target === "_parent" || target === "_self")
                    && (hrefParam === undefined || hrefParam === "")) {
                var confirmMsg = $(btn).data("confirmation");
                $(btn).off("click");
                $(btn).removeAttr("onclick");
                $(btn).on("click", function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    if (confirmMsg === "" || confirmMsg === null || confirmMsg === undefined || confirm(confirmMsg)) {
                        if (typeof PwaUtil === 'undefined' || PwaUtil.isOnline !== false && !(target === "_top" || target === "_parent")) {
                            let template = "template_multiPurposeTemplate";
                            OnsenMobileAjaxComponent.pushPage(true, template, null, null, function (template) {
                                OnsenMobileAjaxComponent.call($(btn), url, "GET", null, null, null, null, template);
                            });
                        } else {
                            if (target === "" || target.toLowerCase() === "_self" || target.toLowerCase() === "_top") {
                                window.top.location = url;
                            } else if (target.toLowerCase() === "_parent") {
                                if (window.parent) {
                                    window.parent.location = url;
                                } else {
                                    document.location = url; 
                                }
                            }
                        }
                    }
                    return false;
                });
            }
        });

        //remove pagination if only 1 page
        if ($(element).find(".dataList .pagelinks a").length === 0) {
            $(element).find(".dataList .pagelinks").css("visibility", "hidden");
        }
    },
    
    /*
     * Override the button behaviour
     */
    overrideButtonEvent : function(element) {
        $(element).find("button[onclick]:not(.off_ajax), input[type=button][onclick]:not(.off_ajax)").each(function(){
            if (typeof PwaUtil === 'undefined' || PwaUtil.isOnline !== false) {
                var btn = $(this);
                var onclick = $(btn).attr("onclick");
                if (onclick.indexOf("window.location") !== -1 || onclick.indexOf("top.location") !== -1 || onclick.indexOf("parent.location") !== -1
                        || onclick.indexOf("window.document.location") !== -1 || onclick.indexOf("top.document.location") !== -1 || onclick.indexOf("parent.document.location") !== -1) {
                    var url = "";
                    var confirmMsg = "";
                    if (onclick.indexOf("confirm(") > 0) {
                        var part = AjaxComponent.getMsgAndRedirectUrl(onclick);
                        confirmMsg = part[0];
                        url = part[1];
                    } else {
                        url = onclick.match(/(['"])((?:\\\1|(?:(?!\1).))+)\1/g)[0];
                        url = url.substring(1, url.length - 1);
                    }
                    if (url !== "" && AjaxComponent.isCurrentUserviewUrl(url)) {
                        $(btn).off("click");
                        $(btn).removeAttr("onclick");
                        $(btn).on("click", function(e) {
                            e.preventDefault();
                            e.stopPropagation();
                            e.stopImmediatePropagation();
                            if (confirmMsg === "" || confirmMsg === null || confirmMsg === undefined || confirm(confirmMsg)) {
                                if ($(btn).attr('id') === 'cancel') {
                                    OnsenMobileAjaxComponent.pushPage(false, null, null, null, function (template) {
                                        $(window).trigger('resize');
                                    });
                                } else {
                                    let template = "template_multiPurposeTemplate";
                                    OnsenMobileAjaxComponent.pushPage(true, template, null, null, function (template) {
                                        OnsenMobileAjaxComponent.call($(btn), url, "GET", null, null, null, null, template);
                                    });
                                }
                            }
                            return false;
                        });
                    }
                }
            }
            return true;
        });
    },
    
    /*
     * Override the form submission behaviour
     */
    overrideFormEvent : function(element) {
        $(element).find("form:not(.off_ajax)").off("submit");
        $(element).find("form:not(.off_ajax)").on("submit", function(e){
            if (typeof PwaUtil === 'undefined' || PwaUtil.isOnline !== false) {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();

                var form = $(this);
                //datalist filter form
                if ($(form).hasClass("filter_form") && $(form).closest(".dataList").length > 0) {
                     var params = UrlUtil.serializeForm($(form));
                     var queryStr = window.location.search;
                     params = params.replace(/\+/g, " ");
                     var newUrl = window.location.pathname + "?" + UrlUtil.mergeRequestQueryString(queryStr, params);
                     OnsenMobileAjaxComponent.call($(form), newUrl, "GET", null);
                } else {
                    var formData = new FormData($(form)[0]);
                    var btn;
                    if (e.originalEvent !== undefined && e.originalEvent.submitter !== undefined) {
                       btn = $(e.originalEvent.submitter);
                    } else {
                       btn = $(this).find(document.activeElement);
                    }
                    if (($(btn).length === 0 || !$(btn).is('input[type=submit], input[type=button], button, a')) && $(this).find("input[type=submit]:focus, input[type=button]:focus, button:focus").length === 0) {
                        btn = $(this).find("input[type='submit'][name], input[type='button'][name], button[name]").eq(0);
                    }
                    if ($(btn).length > 0) {
                        $(btn).each(function(){
                            $(this).attr('clicked', 'true');
                            formData.append($(this).attr("name"), $(this).val());
                        });
                    }
                    if (typeof PwaUtil !== 'undefined'){
                        PwaUtil.submitForm(form);
                    }
                    var url = $(form).attr("action");
                    if (url === "") {
                        url = window.location.href;
                    }
                    $.unblockUI();
                    OnsenMobileAjaxComponent.call($(form), url, "POST", formData, null, null, null, null);
                }
                
                return false;
            } else {
                var btn = $(this).find("input[type=submit][name]:focus, input[type=button][name]:focus, button[name]:focus");
                if ($(btn).length === 0 && $(this).find("input[type=submit]:focus, input[type=button]:focus, button:focus").length === 0) {
                    btn = $(this).find("input[type=submit][name], input[type=button][name], button[name]").eq(0);
                }
                if ($(btn).length > 0) {
                    $(btn).each(function () {
                        $(this).attr('clicked', 'true');
                    });
                }
                PwaUtil.submitForm(this);
                return true;
            }
        });
    },
    
    /*
     * push page to navigate to another page or pop out from current page
     */
    pushPage: function(pushPage, template, title, animation, callback) {
        if (pushPage) {
            // Set default animation to 'lift' if not provided
            if (animation === null || animation === undefined) {
                animation = 'lift';
            }
            // If template is 'template_multiPurposeTemplate', handle cloning and appending
            if (template === 'template_multiPurposeTemplate') {
                var clonedElement = $("[id='" + template + ".html']").clone();
                //generate new template ID
                template = template + multiPurposeTemplateCount;
                //reset the id of template
                clonedElement.attr('id', template + '.html');
                clonedElement.contents().eq(1).attr('id', template);
                
                $('body > #page > #main > div.templates').append(clonedElement);
                multiPurposeTemplateCount++;
            }
            // Push the page to the navigator
            document.querySelector('#onsen-navigator').pushPage(template + ".html", {
                animation: animation,
                data: {
                title: title
                }
            }).then(function() {
                if (callback && typeof callback === 'function') {
                    callback(template);
                }
            });
        } else {
            // Pop the page from the navigator
            document.querySelector('#onsen-navigator').popPage({
                callback: function () {
                    // Retrieve the top template
                    template = OnsenMobileAjaxComponent.getTopTemplate();
                    if (callback && typeof callback === 'function') {
                        callback(template);
                    }
                }
            });
        }
    },
    
    removeParamsfromURL: function (url) {
        if (url.indexOf('?') !== -1) {
            return url.split('?')[0];
        }
        return url;
    },
    
    // Get the current on top template
    getTopTemplate: function () {
        // Get the id of the top page in the navigator
        var template = document.querySelector('#onsen-navigator').topPage.id;
        if (template === 'template_Splitter') {
            if ($('#onsenTabbar > .tabbar > ons-tab.active').length > 0) {
                template = $('#onsenTabbar > .tabbar > ons-tab.active').attr('id');
                // Check if any inner tab is active
                if ($('ons-page#' + template + ' .page__content ons-tab.active.tabbar--top__item').length > 0) {
                    template = $("ons-page#" + template + ' .page__content ons-tab.active.tabbar--top__item').attr('id');
                }
            } else {
                // If no tab is active, set template to 'template_default'
                template = 'template_default';
            }
        }
        return template;
    },
 
    /*
     * Ajax call to retrieve the component html
     */
    call: function (element, url, method, formData, customCallback, customErrorCallback, isTriggerByEvent, template, targetUrl) {
        if (url.indexOf("?") === 0) {
            template = OnsenMobileAjaxComponent.getTopTemplate();
            var currentUrl = window.location.href;
            // Get currentUrl form the current active page
            if($('ons-pull-hook#pull-hook-' + template).length){
                currentUrl = $('ons-pull-hook#pull-hook-' + template).attr('href');
            }
            if (currentUrl.indexOf("?") > 0) {
                currentUrl = currentUrl.substring(0, currentUrl.indexOf('?'));
            }
            url = currentUrl + url;
        } else if (url.indexOf("http") !== 0 && url.indexOf("/") !== 0) {
            var currentUrl = window.location.href;
            url = currentUrl.substring(0, currentUrl.lastIndexOf('/') + 1) + url;
        }
        
        if ($(".ma-backdrop").is(":visible")) {
            $(".ma-backdrop").trigger("click.sidebar-toggled");
        }
        if ((!AjaxComponent.isCurrentUserviewUrl(url) || (typeof PwaUtil !== 'undefined' && PwaUtil.isOnline === false ) || AjaxComponent.isLanguageSwitching(url)) && !url.includes("builderPreview")) {
            window.top.location.href = url; 
            return;
        }
        var isAjaxComponent = false;
        if (method === "POST") {
            url = UrlUtil.updateUrlParam(url, ConnectionManager.tokenName, ConnectionManager.tokenValue);
        }
        
        var headers = new Headers();
        headers.append(ConnectionManager.tokenName, ConnectionManager.tokenValue);
        headers.append("__ajax_theme_loading", "true");
        
        var contentConatiner = $("#content.page_content");
        
        if (AjaxComponent.isCurrentUserviewPage(url)) {
            if ($(element).closest("[data-ajax-component]").length > 0) {
                isAjaxComponent = true;
                contentConatiner = $(element).closest("[data-ajax-component]");

                headers.append("__ajax_component", $(contentConatiner).attr("id"));
                
                if(isTriggerByEvent) {
                    $(contentConatiner).data("event-url", url);
                } else {
                    //merge parameter with the url trigger by event
                    if ($(contentConatiner).data("event-url") !== undefined) {
                        var qs1 = "";
                        var qs2 = "";
                        if ($(contentConatiner).data("event-url").indexOf("?") !== -1) {
                            qs1 = $(contentConatiner).data("event-url").substring($(contentConatiner).data("event-url").indexOf("?") + 1);
                        }
                        if (url.indexOf("?") !== -1) {
                            qs2 = url.substring(url.indexOf("?") + 1);
                        }
                        
                        url = window.location.pathname + "?" + UrlUtil.mergeRequestQueryString(qs1, qs2);
                    }
                }
            }
            //check it is a link clicked event, trigger event and do nothing else
            if ($(element).closest("[data-ajax-component][data-events-triggering]").length > 0 && method === "GET" && AjaxComponent.isLinkClickedEvent($(element).closest("[data-ajax-component][data-events-triggering]"), url)) {
                return;
            }
        } else {
            if (window['AjaxUniversalTheme'] === undefined && !url.includes("builderPreview")) { 
                window.top.location.href = url;
                return;
            }
            AjaxComponent.unbindEvents();
        }
        
        $(contentConatiner).addClass("ajaxloading");
        
        var contentPlaceholder = $(element).data("ajax-content-placeholder");
        if (contentPlaceholder === undefined || contentPlaceholder === null || contentPlaceholder === "") {
            contentPlaceholder = AjaxComponent.getContentPlaceholder(url);
            
            if (contentPlaceholder === undefined || contentPlaceholder === null || contentPlaceholder === "") {
                contentPlaceholder = $(contentConatiner).data("ajax-content-placeholder");
            }
        }
        $(contentConatiner).attr("data-content-placeholder", contentPlaceholder);
        $(contentConatiner).removeAttr("aria-live");
        
        var args = {
            method : method,
            headers: headers
        };
        
        if (formData !== undefined && formData !== null) {
            formData.append(ConnectionManager.tokenName, ConnectionManager.tokenValue);
            args["body"] = formData;
        }
        
        //modified the preview link to actual link
        if (url.indexOf("builderPreview") !== -1) {
            var parts = url.split("/");
            var UIPath = parts[parts.length - 1];

            var modifiedUrl = url.replace('console/app', 'userview');
            modifiedUrl = modifiedUrl.replace(/\/userview\/builderPreview\/.*/, "").replace(/\/$/, "");
            
            var replaceParts = modifiedUrl.split("/");
            replaceParts[replaceParts.length - 1] = 'v/_/' + UIPath;
            var modifiedUrl = replaceParts.join("/");
            
            url = modifiedUrl;
            var baseUrl = window.location.origin;
            if(!url.includes(baseUrl)){
                url = baseUrl + url;
            }
        }
        
        fetch(url, args)
        .then(function (response) {
            if (response.status === 403) {
                if (AjaxComponent.retry !== true) {
                    AjaxComponent.retry = true;
                    //could be csrf token expired, retrieve new token and retry once
                    $.ajax({
                        type: 'POST',
                        url: UI.base + "/csrf",
                        headers: {
                            "FETCH-CSRF-TOKEN-PARAM":"true",
                            "FETCH-CSRF-TOKEN":"true"
                        },
                        success: function (response) {
                            var temp = response.split(":");
                            ConnectionManager.tokenValue = temp[1];
                            JPopup.tokenValue = temp[1];

                            $("iframe").each(function() {
                                try {
                                    if (this.contentWindow.ConnectionManager !== undefined) {
                                        this.contentWindow.ConnectionManager.tokenValue = temp[1];
                                    }
                                    if (this.contentWindow.JPopup !== undefined) {
                                        this.contentWindow.JPopup.tokenValue = temp[1];
                                    }
                                } catch(err) {}
                            });
                            OnsenMobileAjaxComponent.call(element, url, method, formData, customCallback, customErrorCallback, isTriggerByEvent);
                        },
                        completed: function() {
                            AjaxComponent.retry = false;
                        }
                    });
                } else {
                    document.location.href = url;
                }
            }
            
            const disposition = response.headers.get('Content-Disposition');
            if (disposition !== null && disposition.indexOf("attachment;") === 0) {
                var filename = "download";
                var i = disposition.toLowerCase().indexOf("utf-8''");
                if (i !== -1) {
                    filename = decodeURIComponent(disposition.substring(i+7));
                } else {
                    filename = disposition.split(/;(.+)/)[1].split(/=(.+)/)[1];
                }
        
                //it is file
                var a = document.createElement("a");
                a.setAttribute("download", filename);
                //check environment
                if (navigator.userAgent.toLowerCase().includes('android')) {
                    // If the environment is Android, directly retrieve the URL from the response
                    a.href = response.url;
                    a.click();
                } else {
                    response.blob().then((b) => {
                        a.href = URL.createObjectURL(b);
                        a.click();
                    });
                }
                $(contentConatiner).removeClass("ajaxloading");
                return null;
            } else {
                if (response.url.indexOf("/web/login") !== -1) {
                    document.location.href = url;
                    return null;
                } else if (AjaxComponent.isLanguageSwitching(response.url)) {    
                    document.location.href = response.url;
                    return null;
                } else if ((method === "GET" || response.redirected) && response.status === 200) {
                    //only change url if is page change or main component
                    if (!isAjaxComponent || $(contentConatiner).hasClass("main-component")) {
                        var resUrl = response.url;
                        history.pushState({url: resUrl}, "", resUrl); //handled redirected URL
                    }
                }
                return response.text();
            }
        })
        .then(function (data){
            if (data !== null) {
                if (data.indexOf("<html>") !== -1 && data.indexOf("</html>") !== -1) {
                    //handle userview redirection with alert
                    if (data.indexOf("<div") === -1) {
                        var currentUrl = document.location.href;
                        var part = AjaxComponent.getMsgAndRedirectUrl(data);
                        if (part[0] !== "") {
                            alert(part[0]);
                        }
                        if (part[1] !== null && part[1] !== undefined) { //if there is URL
                            if (part[2] === null) { //if no target window, use current window
                                if (part[1] === "") { // it is a reload when url is empty
                                    part[1] = document.location.href;
                                }
                                //if redirect url is not same with current userview page
                                if (!AjaxComponent.isCurrentUserviewPage(part[1])) {
                                    OnsenMobileAjaxComponent.call($("#content.page_content"), part[1], "GET", null);
                                } else {
                                    AjaxComponent.triggerEvents(contentConatiner, url, method);
                                    //if alert exist, add currentUrl to the call
                                    OnsenMobileAjaxComponent.call(contentConatiner, part[1], "GET", null, null, null, null, template, currentUrl);
                                }
                            } else { //if target is top or parent window
                                var win = part[2];
                                if (part[1] === "") { // it is a reload when url is empty
                                    part[1] = win.location.href;
                                }
                                if(win["OnsenMobileAjaxComponent"]){ //use ajax component to reload/redirect if exist
                                    if (part[1].indexOf("embed=false") !== -1) { //remove embed false url
                                        part[1] = part[1].replace("embed=false", "");
                                    }
                                    win["OnsenMobileAjaxComponent"].call($("#content.page_content", win["document"]), part[1], "GET", null);
                                } else {
                                    win.location.href = part[1];
                                }
                                part[3] = true; //if the target is parent or top, always close popup if exist
                            }
                        }
                        if (part[3] === true && parent.PopupDialog) { 
                            parent.PopupDialog.closeDialog();
                        }
                        return;
                    }
                }
                if (!isAjaxComponent && window['onsenMobileTheme'] !== undefined) {
                    if (OnsenMobileAjaxComponent.redirectToPreviousPage(targetUrl, url)) {
                        // If there is redirection to the previous page, pop up from the current page.
                        OnsenMobileAjaxComponent.pushPage(false, null, null, null, function (template) {
                            window['onsenMobileTheme'].callback(data, template);
                        });
                    }
                    window['onsenMobileTheme'].callback(data, template);
                } else {
                    OnsenMobileAjaxComponent.callback(contentConatiner, data, url);
                }
                if (customCallback){
                    customCallback();
                }
                
                setTimeout(function(){
                    if (!isAjaxComponent) {
                        AjaxComponent.triggerPageLoadedEvent();
                    }
                    AjaxComponent.triggerEvents(contentConatiner, url, method, formData);
                }, 2);
                
                $(contentConatiner).removeClass("ajaxloading");
                $(contentConatiner).removeAttr("data-content-placeholder");
            }
        })
        .catch(function (error) {
            if (!isAjaxComponent && window['AjaxUniversalTheme'] !== undefined) {
                window['AjaxUniversalTheme'].errorCallback(error);
            } else {
                AjaxComponent.errorCallback(element, error);
            }
            if (customErrorCallback){
                customErrorCallback();
            }
            $(contentConatiner).removeClass("ajaxloading");
            $(contentConatiner).removeAttr("data-content-placeholder");
        });
    },
    
    /*
     * Handle the ajax callback
     */
    callback : function(element, data, url) {
        var newTarget = $(data);
        var eventUrl = $(element).data("event-url");
        $(element).replaceWith(newTarget);
        $(newTarget).data("ajax-url", url);
        if (eventUrl) {
            $(newTarget).data("event-url", eventUrl);
        }
        OnsenMobileAjaxComponent.initContent($(newTarget));

        setTimeout(function(){
            $(window).trigger('resize'); //inorder for datalist to render in correct viewport
        }, 5);
    },
    
    // Check if there is a redirect to the previous page after add, edit, assignment, and process start
    redirectToPreviousPage: function (targetUrl, url) {
        var swap = false;
        //check if required pop page when callback
        if (targetUrl !== null && targetUrl !== undefined) {
            url = window.location.href;
        } else {
            targetUrl = window.location.href;
            swap = true;
        }
        // Check if the url or targetUrl contains the same base URL
        if (OnsenMobileAjaxComponent.removeParamsfromURL(targetUrl).indexOf(OnsenMobileAjaxComponent.removeParamsfromURL(url)) !== -1) {
            if (swap) {
                //swap the value for validation
                targetUrl = url;
                url = window.location.href;
            }
            // Get mode and action from searchParams of targetUrl
            const searchParams = new URLSearchParams(targetUrl.substring(targetUrl.indexOf('?') + 1));
            const mode = searchParams.get('_mode');
            const action = searchParams.get('_action');
            // Check if mode is 'edit', 'add', 'assignment' or action is 'start'
            if ((mode !== null && (mode === 'edit' || mode === 'add' || mode === 'assignment')) || (action !== null && (action === 'start'))) {
                const currentUrlSearchParams = new URLSearchParams(url.substring(url.indexOf('?') + 1));
                const mode1 = currentUrlSearchParams.get('_mode');
                const action1 = currentUrlSearchParams.get('_action');
                if (mode1 === null && action1 === null) {
                    return true;
                }
            }
        }
        return false;
    },
    
    /*
     * Based on the event listening config, listen to the event and do the action based on event
     */
    initEventsListening : function(element) {
        var listen = function(component) {
            if ($(component).is("[data-ajax-component][data-events-listening]") && !$(component).is("[data-events-listening-initialled]")) {
                var events = $(component).data("events-listening");
                var id = $(component).attr("id");
                for (var i in events) {
                    var eventName = events[i].name;
                    var eventObject = events[i].eventObject;
                    if (eventObject !== "") {
                        eventObject = "_" + eventObject;
                    }
                    if (eventName.indexOf(" ") !== -1) {
                        var temp = eventName.split(" ");
                        eventName = "";
                        for (var t in temp) {
                            if (temp[t].trim() !== "") {
                                eventName += temp[t] + eventObject + "." + id + "-" + i + " ";
                            }
                        }
                    } else {
                        eventName = eventName + eventObject + "." + id + "-" + i;
                    }

                    $("body").off(eventName);
                    $("body").on(eventName, "", {element: component, eventObj : events[i]}, function(event){
                        if (console && console.log) {
                            console.log("Event `" + event.type + "." + id + "-" + i + "` received.");
                        }
                        OnsenMobileAjaxComponent.handleEventAction(event.data.element, event.data.eventObj, event);
                    });
                    AjaxComponent.currentUrlEventListening.push(eventName);
                }
                $(component).attr("data-events-listening-initialled", "");
            }
        };
        
        $(element).find("[data-ajax-component][data-events-listening]").each(function() {
            listen($(this));
        });
        if ($(element).is("[data-ajax-component][data-events-listening]")) {
            listen($(element));
        }
    },

    /*
     * Handle the event action when the listened event triggered
     */
    handleEventAction : function(element, eventObj, urlParams) {
        var action = eventObj.action;
        if (action === "hide") {
            $(element).hide();
            AjaxComponent.scrollIntoViewport($(".main-component"));
        } else if (action === "show") {
            $(element).show();
            if (eventObj.disabledScrolling === undefined || eventObj.disabledScrolling === "") {
                AjaxComponent.scrollIntoViewport($(element));
            }
            $(element).attr("aria-live", "polite");
        } else if (action === "reload") {
            var currentAjaxUrl = $(element).closest("[data-ajax-component]").data("ajax-url");
            if (currentAjaxUrl === undefined) {
                currentAjaxUrl = window.location.href;
            }
            OnsenMobileAjaxComponent.call(element, currentAjaxUrl, "GET", null);
            $(element).show();
            if (eventObj.disabledScrolling === undefined || eventObj.disabledScrolling === "") {
                AjaxComponent.scrollIntoViewport($(element));
            }
            $(element).attr("aria-live", "polite");
        } else if (action === "parameters") {
            var url = $(element).closest("[data-ajax-component]").data("ajax-url");
            if (url === undefined || url === null) {
                url = window.location.href;
            }
            var newUrl = AjaxComponent.updateUrlParams(url, eventObj.parameters, urlParams);
            OnsenMobileAjaxComponent.call(element, newUrl, "GET", null, null, null, true);
            $(element).show();
            if (eventObj.disabledScrolling === undefined || eventObj.disabledScrolling === "") {
                AjaxComponent.scrollIntoViewport($(element));
            }
            $(element).attr("aria-live", "polite");
        } else if (action === "reloadPage") {
            if (window['AjaxUniversalTheme'] !== undefined) {
                OnsenMobileAjaxComponent.call($("#content.page_content"), window.location.href, "GET", null);
            } else {
                window.location.reload(true);
            }
        } else if (action === "redirectPage") {
            var url = AjaxComponent.getEventRedirectURL(eventObj.redirectUrl, urlParams);
            if (window['AjaxUniversalTheme'] !== undefined) {
               OnsenMobileAjaxComponent.call($("#content.page_content"), url, "GET", null);
            } else {
                window.location.href = url;
            }
        } else if (action === "redirectComponent") {
            var url = AjaxComponent.getEventRedirectURL(eventObj.redirectUrl, urlParams);
            OnsenMobileAjaxComponent.call($(element), url, "GET", null, null, null, true);
            $(element).show();
            if (eventObj.disabledScrolling === undefined || eventObj.disabledScrolling === "") {
                AjaxComponent.scrollIntoViewport($(element));
            }
            $(element).attr("aria-live", "polite");
        }
    }
};

$(function () {
    OnsenMobileAjaxComponent.initAjax($("body"));
    setTimeout(function () {
        var href = window.location.pathname;
        var newHref = $('ons-tab.active:not(.tabbar--top__item)').attr('href'); 
        var isInnerTab = false;

        if (href.indexOf("jw/web/login") === -1) {
            var $tab = $('ons-tab[href*=\'' + href + '\']');
            // Check if this there is a tab for the href
            if ($tab.length > 0 && href !== newHref) {
                $tab.each(function (index, element) {
                    if ($(element).hasClass('tabbar--top__item')) {
                        isInnerTab = true;
                    }
                });
                if ($tab.length > 1) {
                    $tab = $tab.eq(0);
                }

                if (isInnerTab) {
                    // Activate the parent tab and inner tab
                    var parentPage = $tab.closest('ons-page');
                    var parentTab = $('ons-tab[id*=\'' + parentPage.attr('id') + '\']:not(.tabbar--top__item)');
                    parentTab.click();
                    $tab.click();
                } else {
                    // Activate the tab
                    $tab.click();
                }
            } else {
                // Not a tab
                if (newHref !== null && newHref !== undefined) {
                    if (AjaxComponent.isCurrentUserviewUrl(newHref)) {
                        var template = OnsenMobileAjaxComponent.getTopTemplate();
                        OnsenMobileAjaxComponent.call($("#content.page_content"), newHref, "get", null, null, null, null, template);
                    }
                    
                    // If the current href is not the first tab href, then push a new page for the href
                    if (href !== newHref) {
                        var template = "template_multiPurposeTemplate";
                        OnsenMobileAjaxComponent.pushPage(true, template, null, null, function (template) {
                            OnsenMobileAjaxComponent.call($("#content.page_content"), href, "get", null, null, null, null, template);
                        });
                    }
                } else {
                    // Set href to the current window location
                    href = window.location.href;
                    if (AjaxComponent.isCurrentUserviewUrl(href)) {
                        OnsenMobileAjaxComponent.call($("#content.page_content"), href, "get", null, null, null, null);
                    }
                }
            }
        } else {
            var tokenName = ConnectionManager.tokenName;
            var tokenValue = ConnectionManager.tokenValue;
             var hiddenInput = $('<input>').attr({
                    type: 'hidden',
                    name: tokenName,
                    value: tokenValue
                });
            $('#content.page_content #loginForm').append(hiddenInput);
        }
    }, 200);
});
