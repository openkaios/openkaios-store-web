const requestOptions={};class StoreDatabaseAPI{constructor(){}async loadDb(){this.stores=JSON.parse(window.localStorage.getItem("DatabaseURLs")),this.ratingServers=JSON.parse(window.localStorage.getItem("RatingServers")),this.currentStore={index:0,url:this.stores[0]},this.currentRatingServer={index:0,url:this.ratingServers[0]},this.db={categories:{all:{name:i18next.t("all-apps"),icon:"fas fa-store"}},apps:{objects:{},downloadCounts:{},ratings:{}},generatedAt:null};for(const e of this.stores){const t=await fetch(e,requestOptions);if(!t.ok)continue;this.currentStore.index=this.stores.indexOf(e),this.currentStore.url=e,console.log(e);const s=await t.json();if([2,3].includes(s.version)){this.db.generatedAt=s.generated_at,this.db.categories.all={name:i18next.t("all-apps"),icon:"fas fa-store"},Object.assign(this.db.categories,s.categories);for(const e of s.apps)this.db.apps.objects[e.name]=e;break}}}getAppsByCategory(e){const t=this;return new Promise((s,r)=>{this.db.categories.hasOwnProperty(e)||r(new Error('Category "'+e+'" does not exist!')),"all"==e&&s(this.db.apps.objects);const a=new Worker("assets/js/lib/storedb/workers/category-worker.js");a.onmessage=e=>{a.terminate(),s(e.data)},a.onerror=e=>{a.terminate(),r(e)},a.postMessage({apps:t.db.apps.objects,category:e})})}sortApps(e,t){const s=this;return new Promise((r,a)=>{const o=new Worker("assets/js/lib/storedb/workers/sort-worker.js");switch(o.onmessage=function(e){o.terminate(),r(e.data)},o.onerror=function(e){o.terminate(),a(e)},t){case"alphabetical":case"categorical":o.postMessage({sort:t,apps:e});break;case"popularity":o.postMessage({sort:t,apps:e,downloadCounts:s.db.apps.downloadCounts});break;case"ratings":o.postMessage({sort:t,apps:e,ratings:s.db.apps.ratings});break;default:console.warn("[StoreDb] Unable to sort, returning unsorted apps."),r(e)}})}searchApps(e){const t=this;return new Promise((s,r)=>{const a=new Worker("assets/js/lib/storedb/workers/search-worker.js");a.onmessage=e=>{a.terminate(),s(e.data)},a.onerror=e=>{a.terminate(),r(e)},a.postMessage({query:e,apps:t.db.apps.objects})})}async dlCountApp(e){await fetch(`${this.currentRatingServer.url}/download_counter/count/${e}`)}async getAppRatings(e){const t=await fetch(`${this.currentRatingServer.url}/ratings/${e}`);if(!t.ok)throw new Error(`Unable to fetch ratings for app ${e}.`);return await t.json()}async loginToRatingsAccount(e,t){if(!(await fetch(this.currentRatingServer.url+"/checkuser",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username:e,logintoken:t})})).ok)throw new Error("Unable to login.")}async createRatingsAccount(e,t){if(!(await fetch(this.currentRatingServer.url+"/createuser",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username:e,logintoken:t})})).ok)throw new Error("Unable to create account.")}async addNewRating(e,t,s,r,a){if(!(await fetch(`${this.currentRatingServer.url}/ratings/${s}/add`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username:e,logintoken:t,points:r,description:a})})).ok)throw new Error(`Unable to create new rating for app ${s}.`)}}