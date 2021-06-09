"use strict";let currentSelectedCategory="all";const StoreDbAPI=new StoreDatabaseAPI;let isFirstInitCompleted=!1,currentWebStoreVersion="";function separateArrayCommas(e){let t="";const n=e.length;for(const a in e)t+=a+1<n?e[a]+", ":e[a]+" ";return t}function generateReadableCategories(e){const t=[];for(const n in e){const a=e[n],o=StoreDbAPI.db.categories[a].name;o?t.push(o):t.push(a)}return separateArrayCommas(t)}function listAppsByCategory(e,t){return StoreDbAPI.sortApps(StoreDbAPI.getAppsByCategory(e),t)}function reloadAppRatings(e){appDetailsModal.content.ratings.loggedIn.details.innerHTML="<strong>@Unknown</strong>",appDetailsModal.content.ratings.loggedIn.points.value=1,appDetailsModal.content.ratings.loggedIn.points.disabled=!0,appDetailsModal.content.ratings.loggedIn.ratingIncompleteBlurb.classList.add("is-hidden"),appDetailsModal.content.ratings.loggedIn.submitButton.classList.add("is-loading"),appDetailsModal.content.ratings.loggedIn.submitButton.disabled=!0,appDetailsModal.content.ratings.averageRating.innerText="Unknown ★",appDetailsModal.content.ratings.allRatings.innerHTML="Loading ratings...",StoreDbAPI.getAppRatings(e).then((function(t){appDetailsModal.content.ratings.allRatings.innerHTML="";let n=!1;t.response.data.average&&(appDetailsModal.content.ratings.averageRating.innerText=t.response.data.average.toFixed(1)+" ★");for(const e of t.response.data.ratings)if(e.username===userDetails.username)appDetailsModal.content.ratings.loggedIn.details.innerHTML=`<strong>@${e.username}</strong> (you) • <small>${dayjs.unix(e.creationtime).fromNow()}</small>`,appDetailsModal.content.ratings.loggedIn.points.disabled=!1,appDetailsModal.content.ratings.loggedIn.points.value=e.points,appDetailsModal.content.ratings.loggedIn.points.disabled=!0,n=!0;else{const t=document.createElement("div");t.classList.add("box"),appDetailsModal.content.ratings.allRatings.appendChild(t);const n=document.createElement("article");n.classList.add("media"),t.appendChild(n);const a=document.createElement("div");a.classList.add("media-content"),n.appendChild(a);const o=document.createElement("div");o.classList.add("content"),a.appendChild(o);const s=document.createElement("p");s.innerHTML=`<strong>@${e.username}</strong> • <small>${e.points} ★</small> • <small>${dayjs.unix(e.creationtime).fromNow()}</small>`,o.appendChild(s)}appDetailsModal.content.ratings.loggedIn.submitButton.setAttribute("data-app-appid",e),n?(appDetailsModal.content.ratings.loggedIn.points.disabled=!0,appDetailsModal.content.ratings.loggedIn.submitButton.disabled=!0):(appDetailsModal.content.ratings.loggedIn.details.innerHTML=`<strong>@${userDetails.username}</strong> (you)`,appDetailsModal.content.ratings.loggedIn.points.disabled=!1,appDetailsModal.content.ratings.loggedIn.submitButton.disabled=!1),appDetailsModal.content.ratings.loggedIn.submitButton.classList.remove("is-loading")})).catch((function(e){bulmaToast.toast({message:window.lang.translate("rating-load-error"),type:"is-danger"}),console.error(e)}))}const appDownloadsModal={controller:new BulmaModal("#app-download-modal"),content:{name:document.getElementById("app-download-modal-app-name"),icon:document.getElementById("app-download-modal-app-icon"),qrcode:document.getElementById("app-download-modal-app-download-qrcode")},buttons:{download:document.getElementById("app-download-modal-download-button")}};appDownloadsModal.buttons.download.onclick=function(e){e.target.classList.add("is-loading"),e.target.disabled=!0,StoreDbAPI.dlCountApp(e.target.getAttribute("data-app-appid")).then((function(){e.target.disabled=!1,e.target.classList.remove("is-loading")})).catch((function(){e.target.disabled=!1,e.target.classList.remove("is-loading"),bulmaToast.toast({message:window.lang.translate("download-record-error"),type:"is-danger"})})),window.open(e.target.getAttribute("data-app-download"),"_blank")};const appDetailsModal={controller:new BulmaModal("#app-details-modal"),content:{name:document.getElementById("app-details-modal-app-name"),icon:document.getElementById("app-details-modal-app-icon"),screenshots:{container:document.getElementById("app-details-modal-app-screenshots-container"),scroller:document.getElementById("app-details-modal-app-screenshots")},descriptionSeparator:document.getElementById("app-details-modal-description-separator"),description:document.getElementById("app-details-modal-app-description"),categories:document.getElementById("app-details-modal-app-categories"),authors:document.getElementById("app-details-modal-app-authors"),maintainers:document.getElementById("app-details-modal-app-maintainers"),dependencies:document.getElementById("app-details-modal-app-dependencies"),version:document.getElementById("app-details-modal-app-version"),type:document.getElementById("app-details-modal-app-type"),locales:document.getElementById("app-details-modal-app-locales"),has_ads:document.getElementById("app-details-modal-app-has_ads"),has_tracking:document.getElementById("app-details-modal-app-has_tracking"),license:document.getElementById("app-details-modal-app-license"),downloadCount:document.getElementById("app-details-modal-app-downloadCount"),ratings:{notLoggedIn:document.getElementById("app-details-modal-app-ratings-not-logged-in"),loggedIn:{container:document.getElementById("app-details-modal-app-ratings-logged-in"),details:document.getElementById("app-details-modal-app-ratings-logged-in-details"),points:document.getElementById("app-details-modal-app-ratings-logged-in-points"),ratingIncompleteBlurb:document.getElementById("app-details-modal-rating-incomplete-blurb"),submitButton:document.getElementById("app-details-modal-app-ratings-logged-in-submit-button")},averageRating:document.getElementById("app-details-modal-app-ratings-average-rating"),allRatings:document.getElementById("app-details-modal-app-ratings-all-ratings")}},buttons:{download:document.getElementById("app-details-modal-download-button"),website:document.getElementById("app-details-modal-website-button"),repo:document.getElementById("app-details-modal-repo-button"),donation:document.getElementById("app-details-modal-donation-button")}};appDetailsModal.controller.addEventListener("modal:show",(function(){document.getElementsByTagName("html")[0].classList.add("is-clipped")})),appDetailsModal.controller.addEventListener("modal:close",(function(){document.getElementsByTagName("html")[0].classList.remove("is-clipped")})),appDetailsModal.buttons.download.onclick=function(){appDownloadsModal.controller.show()},appDetailsModal.buttons.website.onclick=function(e){window.open(e.target.getAttribute("data-app-website"),"_blank")},appDetailsModal.buttons.repo.onclick=function(e){window.open(e.target.getAttribute("data-app-repo"),"_blank")},appDetailsModal.buttons.donation.onclick=function(e){window.open(e.target.getAttribute("data-app-donate"),"_blank")},appDetailsModal.content.ratings.loggedIn.submitButton.onclick=function(){appDetailsModal.content.ratings.loggedIn.ratingIncompleteBlurb.classList.add("is-hidden"),appDetailsModal.content.ratings.loggedIn.points.value.length>0&&isUserLoggedIn?(appDetailsModal.content.ratings.loggedIn.submitButton.classList.add("is-loading"),appDetailsModal.content.ratings.loggedIn.submitButton.disabled=!0,appDetailsModal.content.ratings.loggedIn.points.disabled=!0,StoreDbAPI.addNewRating(userDetails.username,userDetails.logintoken,appDetailsModal.content.ratings.loggedIn.submitButton.getAttribute("data-app-appid"),appDetailsModal.content.ratings.loggedIn.points.value).then((function(){setTimeout((function(){reloadAppRatings(appDetailsModal.content.ratings.loggedIn.submitButton.getAttribute("data-app-appid"))}),2e3)})).catch((function(){setTimeout((function(){reloadAppRatings(appDetailsModal.content.ratings.loggedIn.submitButton.getAttribute("data-app-appid"))}),2e3)}))):appDetailsModal.content.ratings.loggedIn.ratingIncompleteBlurb.classList.remove("is-hidden")};let appCardColumn=0;const appCardsColumnElements=[document.getElementById("app-cards-column-0"),document.getElementById("app-cards-column-1"),document.getElementById("app-cards-column-2")],appCardsContainerElement=document.getElementById("app-cards-container");function addAppCard(e){appCardsColumnElements[appCardColumn].appendChild(document.createElement("br"));const t=document.createElement("div");t.id=e.slug,t.classList.add("card"),appCardsColumnElements[appCardColumn].appendChild(t);const n=document.createElement("div");n.classList.add("card-content"),t.appendChild(n);const a=document.createElement("div");a.classList.add("media"),n.appendChild(a);const o=document.createElement("div");o.classList.add("media-left"),a.appendChild(o);const s=document.createElement("figure");s.classList.add("image","is-48x48","is-unselectable");const l=document.createElement("img");l.src=e.icon,s.appendChild(l),o.appendChild(s);const i=document.createElement("div");i.classList.add("media-content"),a.appendChild(i);const d=document.createElement("p");d.classList.add("title","is-4"),d.innerText=e.name,i.appendChild(d);const r=document.createElement("p");r.classList.add("subtitle","is-6"),r.innerText=generateReadableCategories(e.meta.categories),i.appendChild(r);const c=document.createElement("div");c.classList.add("content"),c.innerText=e.description,n.appendChild(c);const p=document.createElement("footer");p.classList.add("card-footer"),t.appendChild(p);const u=document.createElement("a");if(u.classList.add("card-footer-item","is-unselectable","app"),u.setAttribute("data-app-categories",e.meta.categories.toString()),u.setAttribute("data-app-name",e.name),u.setAttribute("data-app-slug",e.slug),u.setAttribute("lang","en"),u.innerText=window.lang.translate("app-details"),p.appendChild(u),navigator.share){const t=document.createElement("a");t.classList.add("card-footer-item","is-unselectable"),t.setAttribute("lang","en"),t.innerText=window.lang.translate("share-app"),t.onclick=function(){navigator.share({title:e.name,text:e.description,url:"https://store.openkaios.top/#"+e.slug}).then((function(){console.log(`[Index Controller] Shared app '${e.slug}' successfully.`)})).catch((function(t){console.error(`[Index Controller] Could not share app '${e.slug}': `+t)}))},p.appendChild(t)}else if(navigator.clipboard){const t=document.createElement("a");t.classList.add("card-footer-item","is-unselectable"),t.setAttribute("lang","en"),t.innerText=window.lang.translate("copy-app"),t.onclick=function(){navigator.clipboard.writeText("https://store.openkaios.top/#"+e.slug).then((function(){console.log(`[Index Controller] Copied app '${e.slug}' to clipboard successfully.`)})).catch((function(t){console.error(`[Index Controller] Could not copy app '${e.slug}' to clipboard: `+t)}))},p.appendChild(t)}switch(appCardColumn){case 0:appCardColumn=1;break;case 1:appCardColumn=2;break;case 2:appCardColumn=0}}appCardsContainerElement.onclick=function(e){if(e.target.classList.contains("app")){const t=e.target.getAttribute("data-app-categories").split(",")[0];if(t in StoreDbAPI.db.apps.categorical){const n=StoreDbAPI.db.apps.categorical[t][e.target.getAttribute("data-app-name")];if(n){if(n.name?(appDetailsModal.content.name.innerText=n.name,appDownloadsModal.content.name.innerText=n.name):(appDetailsModal.content.name.innerText="Unknown app name",appDownloadsModal.content.name.innerText="Unknown app name"),n.icon?(appDetailsModal.content.icon.src=n.icon,appDownloadsModal.content.icon.src=n.icon):(appDetailsModal.content.icon.src="icons/default-icon.png",appDownloadsModal.content.icon.src="icons/default-icon.png"),n.screenshots.length>0){appDetailsModal.content.screenshots.container.style.display="initial",appDetailsModal.content.screenshots.scroller.innerHTML="",appDetailsModal.content.descriptionSeparator.classList.remove("is-hidden");for(const e of n.screenshots){const t=document.createElement("img");t.style.padding="4px",t.src=e,appDetailsModal.content.screenshots.scroller.appendChild(t)}}else appDetailsModal.content.screenshots.container.style.display="none",appDetailsModal.content.descriptionSeparator.classList.add("is-hidden");if(n.description?appDetailsModal.content.description.innerText=n.description:appDetailsModal.content.description.innerText="No description.",n.meta.categories?appDetailsModal.content.categories.innerText=generateReadableCategories(n.meta.categories):appDetailsModal.content.categories.innerText="Unknown",n.author?"string"==typeof n.author?appDetailsModal.content.authors.innerText=n.author:Array.isArray(n.author)&&(appDetailsModal.content.authors.innerText=separateArrayCommas(n.author)):appDetailsModal.content.authors.innerText="Unknown",n.maintainer?"string"==typeof n.maintainer?appDetailsModal.content.maintainers.innerText=n.maintainer:Array.isArray(n.maintainer)&&(appDetailsModal.content.maintainers.innerText=separateArrayCommas(n.maintainer)):appDetailsModal.content.maintainers.innerText="Unknown",n.dependencies)if(appDetailsModal.content.dependencies.innerHTML="",typeof n.dependencies.length>0)for(let e=0;e<n.dependencies.length;e++)n.dependencies[e].hasOwnProperty("url")?appDetailsModal.content.dependencies.innerHTML='<a href="'+n.dependencies[e].url+'" target="_blank">'+n.dependencies[e].name+"</a>":appDetailsModal.content.dependencies.innerHTML=n.dependencies[e].name;else 0===n.dependencies.length?appDetailsModal.content.dependencies.innerText="(None)":Array.isArray(n.dependencies)&&n.dependencies.forEach(e=>{""===e.url?appDetailsModal.content.dependencies.innerHTML+=e.name+"&nbsp;":appDetailsModal.content.dependencies.innerHTML+='<a href="'+e.url+'" target="_blank">'+e.name+"</a>&nbsp;"});else appDetailsModal.content.dependencies.innerText="(None)";n.download.version?appDetailsModal.content.version.innerText=n.download.version:appDetailsModal.content.version.innerText="Unknown",n.type?appDetailsModal.content.type.innerText=n.type:appDetailsModal.content.type.innerText="Unknown",n.locales?"string"==typeof n.locales?appDetailsModal.content.locales.innerText=n.locales:Array.isArray(n.locales)&&(appDetailsModal.content.locales.innerText=separateArrayCommas(n.locales)):appDetailsModal.content.locales.innerText="Unknown",void 0!==n.has_ads?appDetailsModal.content.has_ads.innerText=window.lang.translate("ads")+": "+n.has_ads:appDetailsModal.content.has_ads.innerText=window.lang.translate("ads")+": Unknown",void 0!==n.has_tracking?appDetailsModal.content.has_tracking.innerText=window.lang.translate("tracking")+": "+n.has_tracking:appDetailsModal.content.has_tracking.innerText=window.lang.translate("tracking")+": Unknown",n.license?appDetailsModal.content.license.innerText=n.license:appDetailsModal.content.license.innerText="Unknown",StoreDbAPI.db.apps.downloadCounts[n.slug]?appDetailsModal.content.downloadCount.innerText=StoreDbAPI.db.apps.downloadCounts[n.slug]:appDetailsModal.content.downloadCount.innerText="Unknown",reloadAppRatings(n.slug),n.download.url?(appDetailsModal.buttons.download.classList.remove("is-hidden"),appDownloadsModal.buttons.download.classList.remove("is-hidden"),appDownloadsModal.buttons.download.setAttribute("data-app-download",n.download.url),appDownloadsModal.buttons.download.setAttribute("data-app-appid",n.slug),appDownloadsModal.content.qrcode.innerHTML="",new QRCode(appDownloadsModal.content.qrcode,"openkaios:"+n.slug)):(appDetailsModal.buttons.download.classList.add("is-hidden"),appDownloadsModal.buttons.download.classList.add("is-hidden")),n.website?(appDetailsModal.buttons.website.classList.remove("is-hidden"),appDetailsModal.buttons.website.setAttribute("data-app-website",n.website)):appDetailsModal.buttons.website.classList.add("is-hidden"),n.git_repo?(appDetailsModal.buttons.repo.classList.remove("is-hidden"),appDetailsModal.buttons.repo.setAttribute("data-app-repo",n.git_repo)):appDetailsModal.buttons.repo.classList.add("is-hidden"),n.donation?(appDetailsModal.buttons.donation.style.display="initial",appDetailsModal.buttons.donation.setAttribute("data-app-donate",n.donation)):appDetailsModal.buttons.donation.style.display="none",isUserLoggedIn?(appDetailsModal.content.ratings.notLoggedIn.classList.add("is-hidden"),appDetailsModal.content.ratings.loggedIn.container.classList.remove("is-hidden")):(appDetailsModal.content.ratings.loggedIn.container.classList.add("is-hidden"),appDetailsModal.content.ratings.notLoggedIn.classList.remove("is-hidden")),appDetailsModal.controller.show()}else bulmaToast.toast({message:window.lang.translate("app-exist-error")+' "'+t+'"!',type:"is-danger"})}else bulmaToast.toast({message:window.lang.translate("category-exist-error-1")+' "'+t+'" '+window.lang.translate("category-exist-error-2"),type:"is-danger"})}},document.getElementById("scrolltop-fab").onclick=function(){window.scrollTo({top:0,behavior:"smooth"})};const reloadButton=document.getElementById("reload-button"),sortSelect=document.getElementById("sort-select");sortSelect.onchange=function(e){reloadButton.classList.add("is-loading");const t=document.getElementById("sort-icon");switch(t.classList.remove("fa-sort-alpha-down","fa-fire-alt","fa-tags"),e.target.value){case"alphabetical":t.classList.add("fa-sort-alpha-down");break;case"popularity":t.classList.add("fa-fire-alt");break;case"categorical":t.classList.add("fa-tags")}sortSelect.disabled=!0,reloadButton.disabled=!0;for(const e of appCardsColumnElements)e.innerHTML="";appCardColumn=0,listAppsByCategory(currentSelectedCategory,e.target.value).then((function(e){for(const t in e)addAppCard(e[t]);reloadButton.classList.remove("is-loading"),sortSelect.disabled=!1,reloadButton.disabled=!1;try{const e=window.location.hash.split("#")[1];void 0!==e?(document.querySelector(`[data-app-slug="${e}"]`).click(),window.location.hash=e):window.location.hash=""}catch(e){window.location.hash="",console.log(e)}bulmaToast.toast({message:window.lang.translate("app-sort-success"),type:"is-success"})})).catch((function(e){reloadButton.classList.remove("is-loading"),sortSelect.disabled=!1,reloadButton.disabled=!1,bulmaToast.toast({message:window.lang.translate("app-sort-success"),type:"is-danger"}),console.log(e)}))};const categoriesTabsElement=document.getElementById("categories-tabs");categoriesTabsElement.onclick=function(e){const t=e.target.classList;if((t.contains("category-link")||t.contains("category-tab"))&&(currentSelectedCategory=e.target.getAttribute("data-category-id"),currentSelectedCategory in StoreDbAPI.db.categories)){for(const e of document.querySelectorAll(".category-tab"))e.getAttribute("data-category-id")===currentSelectedCategory?e.classList.add("is-active"):e.classList.remove("is-active");sortSelect.dispatchEvent(new Event("change"))}};const userDetails={username:null,logintoken:null},userModal={controller:new BulmaModal("#user-modal"),content:{usernameInput:document.getElementById("user-modal-username-input"),logintokenInput:document.getElementById("user-modal-logintoken-input"),loginFailedBlurb:document.getElementById("user-modal-login-failed-blurb"),saveLoginCheckbox:document.getElementById("user-modal-save-login-checkbox")},buttons:{login:document.getElementById("user-modal-login-button")}};userModal.controller.addEventListener("modal:show",(function(){let e=!1;const t=localStorage.getItem("webstore-ratings-username");null!==t?(userModal.content.usernameInput.value=t,e=!0):userModal.content.usernameInput.value="";const n=localStorage.getItem("webstore-ratings-logintoken");null!==n?(userModal.content.logintokenInput.value=n,e=!0):userModal.content.logintokenInput.value="",e&&(userModal.content.saveLoginCheckbox.checked=!0)})),userModal.controller.addEventListener("modal:close",(function(){userModal.content.loginFailedBlurb.classList.add("is-hidden")}));let isUserLoggedIn=!1;const userButton={button:document.getElementById("user-button"),icon:document.getElementById("user-icon")};function loginSuccessCb(){userModal.content.usernameInput.disabled=!1,userModal.content.logintokenInput.disabled=!1,userModal.buttons.login.disabled=!1,userModal.buttons.login.classList.remove("is-loading"),userButton.button.classList.remove("is-link"),userButton.button.classList.add("is-danger"),userButton.icon.classList.add("fa-sign-out-alt"),userButton.icon.classList.remove("fa-user"),userModal.controller.close(),isUserLoggedIn=!0}userButton.button.onclick=function(){isUserLoggedIn?(userDetails.username=null,userDetails.logintoken=null,userButton.button.classList.remove("is-danger"),userButton.button.classList.add("is-link"),userButton.icon.classList.add("fa-user"),userButton.icon.classList.remove("fa-sign-out-alt"),isUserLoggedIn=!1):userModal.controller.show()},userModal.buttons.login.onclick=function(){userModal.buttons.login.classList.add("is-loading"),userModal.buttons.login.disabled=!0,userModal.content.loginFailedBlurb.classList.add("is-hidden"),userDetails.username=userModal.content.usernameInput.value,userDetails.logintoken=userModal.content.logintokenInput.value,userModal.content.usernameInput.disabled=!0,userModal.content.logintokenInput.disabled=!0,StoreDbAPI.loginToRatingsAccount(userDetails.username,userDetails.logintoken).then((function(e){loginSuccessCb()})).catch((function(e){StoreDbAPI.createRatingsAccount(userDetails.username,userDetails.logintoken).then((function(e){loginSuccessCb()})).catch((function(t){userModal.content.usernameInput.disabled=!1,userModal.content.logintokenInput.disabled=!1,userModal.buttons.login.disabled=!1,userModal.buttons.login.classList.remove("is-loading"),userModal.content.loginFailedBlurb.classList.remove("is-hidden"),console.error(e)}))}))},userModal.content.saveLoginCheckbox.onchange=function(e){e.target.checked?(localStorage.setItem("webstore-ratings-username",userModal.content.usernameInput.value),localStorage.setItem("webstore-ratings-logintoken",userModal.content.logintokenInput.value)):(localStorage.removeItem("webstore-ratings-username"),localStorage.removeItem("webstore-ratings-logintoken"))};const updateModal={controller:new BulmaModal("#webstore-update-modal"),buttons:{update:document.getElementById("webstore-update-modal-update-button")}};function reloadData(){sortSelect.disabled=!0,reloadButton.classList.add("is-loading"),reloadButton.disabled=!0;const e=document.getElementById("webstore-github-commit-label");e.classList.remove("is-danger"),categoriesTabsElement.innerHTML="";for(const e of appCardsColumnElements)e.innerHTML="";StoreDbAPI.loadData().then((function(t){for(const e in t.categories){const n={tab:document.createElement("li"),link:{container:document.createElement("a"),content:{icon:{container:document.createElement("span"),icon:document.createElement("i")},text:document.createElement("span")}}};n.tab.setAttribute("data-category-id",e),n.tab.classList.add("category-tab"),categoriesTabsElement.appendChild(n.tab),n.link.container.setAttribute("data-category-id",e),n.link.container.classList.add("category-link"),n.tab.appendChild(n.link.container),n.link.content.icon.container.setAttribute("data-category-id",e),n.link.content.icon.container.classList.add("icon","is-small","category-link"),n.link.container.appendChild(n.link.content.icon.container);for(const a of t.categories[e].icon.split(" "))n.link.content.icon.icon.classList.add(a);n.link.content.icon.icon.classList.add("category-link"),n.link.content.icon.icon.setAttribute("data-category-id",e),n.link.content.icon.container.appendChild(n.link.content.icon.icon),n.link.content.text.innerText=t.categories[e].name,n.link.content.text.setAttribute("data-category-id",e),n.link.content.text.classList.add("category-link"),n.link.container.appendChild(n.link.content.text)}document.querySelector(`.category-tab[data-category-id*="${currentSelectedCategory}"]`).classList.add("is-active"),sortSelect.dispatchEvent(new Event("change"));const n=document.getElementById("data-generated-time-label");t.generatedAt&&(n.innerText=dayjs(t.generatedAt).fromNow(),n.classList.remove("is-danger"),n.classList.add("is-success"));const a=document.getElementById("data-total-apps-label");a.innerText=t.apps.raw.length,a.classList.remove("is-danger"),a.classList.add("is-success");const o=new Worker("assets/js/index/workers/githubcommit-worker.js");o.onmessage=function(t){o.terminate(),null!==t.data&&(e.innerText=t.data.substring(0,7),e.setAttribute("href","https://github.com/openkaios/openkaios-store-web/blob/"+t.data+"/src/"),e.classList.remove("is-danger"),e.classList.add("is-success"),isFirstInitCompleted||(currentWebStoreVersion=t.data,isFirstInitCompleted=!0),t.data!==currentWebStoreVersion&&updateModal.controller.show())},o.postMessage(null),bulmaToast.toast({message:window.lang.translate("data-load-success"),type:"is-success"})})).catch((function(e){bulmaToast.toast({message:window.lang.translate("data-load-error"),type:"is-danger"}),console.error(e)}))}updateModal.buttons.update.onclick=function(){location.reload()},reloadButton.onclick=function(){reloadData()},reloadData();