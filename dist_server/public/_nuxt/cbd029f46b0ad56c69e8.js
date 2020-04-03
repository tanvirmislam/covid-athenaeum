(window.webpackJsonp=window.webpackJsonp||[]).push([[2],{314:function(t,e,i){var n=i(356);"string"==typeof n&&(n=[[t.i,n,""]]),n.locals&&(t.exports=n.locals),(0,i(12).default)("61d59f78",n,!0,{sourceMap:!1})},355:function(t,e,i){"use strict";var n=i(314);i.n(n).a},356:function(t,e,i){(e=i(11)(!1)).push([t.i,"#globeComponentContainer{height:100%;width:100%}",""]),t.exports=e},361:function(t,e,i){"use strict";i.r(e),i(27),i(92),i(351),i(5),i(4),i(44);var n=i(18),o=(i(74),i(26)),s=i(357),a=i(358),r={data:function(){return{earthquakeDataURL:"https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2020-01-01&endtime=2020-01-02",worldDataURL:"https://unpkg.com/world-atlas@1.1.4/world/110m.json",countryDataURL:"https://gist.githubusercontent.com/mbostock/4090846/raw/07e73f3c2d21558489604a0bc434b3a5cf41a867/world-country-names.tsv",isDataFetched:!1,earthquakes:void 0,world:void 0,worldLand:void 0,worldCountries:void 0,countryList:void 0,canvas:void 0,context:void 0,equirectangularCanvas:void 0,equirectangularContext:void 0,colorToCountry:{},isMounted:!1,dimensions:{screenWidth:void 0,screenHeight:void 0,canvasSquareSide:void 0,canvasMargin:50},scale:void 0,rotations:{yaw:0,pitch:-10,roll:0},colors:{water:"#5CA8BF",land:"#91755C",selectedCountry:"#F2E4E4",earthquake:"#E32929"},autoRotationDegPerSec:5,isRotating:!1,drawLoop:void 0,lastDrawLoopCallTime:void 0,isBeingDrawn:!1,selectedCountry:void 0,lastPinchDistance:void 0,dragSensitivity:75,zoomSensitivity:.1,isBeingDragged:!1,nextUniqueColorSeed:1}},computed:{width:{get:function(){return this.dimensions.canvasSquareSide}},height:{get:function(){return this.dimensions.canvasSquareSide}},radius:{get:function(){return this.dimensions.canvasSquareSide/2}},projection:{get:function(){return s.f().translate([this.width/2,this.height/2]).clipAngle(90).precision(.1)}},graticule:{get:function(){return s.e()}},path:{get:function(){if(this.isMounted)return s.g(this.projection,this.context)}},equirectangularProjection:{get:function(){return s.d().translate([this.width/2,this.height/2]).scale(this.width/7)}},equirectangularPath:{get:function(){if(this.isMounted)return s.g(this.equirectangularProjection,this.equirectangularContext)}},autoRotationDegPerMilliSec:{get:function(){return this.autoRotationDegPerSec/1e3}},earthquakeMagnitudeScale:{get:function(){return s.j().domain([0,100]).range([0,10])}}},watch:{width:function(){this.isMounted&&(this.canvas.attr("width",this.width),this.equirectangularCanvas.attr("width",this.width),this.setupEquirectangularKeys())},height:function(){this.isMounted&&(this.canvas.attr("height",this.height),this.equirectangularCanvas.attr("height",this.height),this.setupEquirectangularKeys())},radius:function(){this.scale=this.radius},scale:function(){this.projection.scale(this.scale)},rotations:function(){this.projection.rotate([this.rotations.yaw,this.rotations.pitch,this.rotations.roll])}},beforeMount:function(){window.addEventListener("resize",this.adjustDimensions)},beforeDestroy:function(){window.removeEventListener("resize",this.adjustDimensions)},mounted:function(){var t=this;return Object(o.a)(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return console.log("DOM mounted"),console.log("Ajusting dimensions"),t.adjustDimensions(),console.log("Fetching data"),e.next=6,t.fetchData();case 6:t.isDataFetched=!0,console.log(t.earthquakes),console.log(t.world),console.log(t.countryList),console.log("Mounting canvas elements"),t.canvas=s.k("#canvasContainer").append("canvas").attr("id","canvas").attr("width",t.width).attr("height",t.height),t.equirectangularCanvas=s.k("#canvasContainer").append("canvas").attr("width",t.width).attr("height",t.height),t.context=t.canvas.node().getContext("2d"),t.equirectangularContext=t.equirectangularCanvas.node().getContext("2d"),t.isMounted=!0,console.log("Setting up initial projection configurations"),t.setupEquirectangularKeys(),t.configureInitialProjection(),console.log("Attaching event listener to canvas"),t.canvas.on("mousemove",t.onMouseMove).call(s.b().on("start",t.onDragStart).on("drag",t.onDrag).on("end",t.onDragEnd)).call(s.n().on("zoom",t.onZoom)),console.log("Setting draw loop timer"),t.isRotating=!0,t.lastDrawLoopCallTime=s.i(),t.drawLoop=s.l(t.draw);case 25:case"end":return e.stop()}}),e)})))()},methods:{fetchData:function(){var t=this;return Object(o.a)(regeneratorRuntime.mark((function e(){var i,o,s,r,c,h,u,l;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,i=t.$axios.get(t.earthquakeDataURL),o=t.$axios.get(t.worldDataURL),s=t.$axios.get(t.countryDataURL),e.next=6,Promise.all([i,o,s]);case 6:r=e.sent,c=Object(n.a)(r,3),h=c[0],u=c[1],l=c[2],t.earthquakes=h.data,t.world=u.data,t.worldLand=a.a(t.world,t.world.objects.land),t.worldCountries=a.a(t.world,t.world.objects.countries),t.countryList=t.tsv2json(l.data),e.next=25;break;case 18:e.prev=18,e.t0=e.catch(0),t.earthquake=void 0,t.world=void 0,t.worldLand=void 0,t.worldCountries=void 0,t.countryList=void 0;case 25:case"end":return e.stop()}}),e,null,[[0,18]])})))()},adjustDimensions:function(){console.log("Adjusting dimensions"),this.dimensions.screenWidth=document.documentElement.clientWidth,this.dimensions.screenHeight=document.documentElement.clientHeight,this.isMounted&&this.context.clearRect(0,0,this.width,this.height),this.dimensions.canvasSquareSide=Math.min(.95*this.dimensions.screenWidth-this.dimensions.canvasMargin,.7*this.dimensions.screenHeight-this.dimensions.canvasMargin)},getUniqueRGBColor:function(){var t=[];return this.nextUniqueColorSeed>16777214&&(this.nextUniqueColorSeed=1),t.push(255&this.nextUniqueColorSeed),t.push((65280&this.nextUniqueColorSeed)>>8),t.push((16711680&this.nextUniqueColorSeed)>>16),this.nextUniqueColorSeed+=5,"rgb("+t.join(",")+")"},setupEquirectangularKeys:function(){for(var t=this.worldCountries.features.length;t--;){var e=this.worldCountries.features[t],i=this.getUniqueRGBColor();this.colorToCountry[i]=e,this.equirectangularContext.beginPath(),this.equirectangularPath(e),this.equirectangularContext.fillStyle=i,this.equirectangularContext.fill()}},getCountryFromImageData:function(t){var e=t.data,i="rgb("+e[0]+","+e[1]+","+e[2]+")";return this.colorToCountry[i]},configureInitialProjection:function(){this.projection.scale(this.scale),this.projection.rotate([this.rotations.yaw,this.rotations.pitch,this.rotations.roll])},selectCountryFromPosition:function(t){var e=this,i=this.projection.invert(t),n=this.equirectangularProjection(i);if(n[0]>-1){var o=this.equirectangularContext.getImageData(n[0],n[1],1,1),s=this.getCountryFromImageData(o);if(void 0===s)this.selectedCountry=void 0;else if(void 0===this.selectedCountry||this.selectedCountry.id!==s.id){this.selectedCountry=s;var a=this.countryList.find((function(t){return parseInt(t.id)===parseInt(e.selectedCountry.id)}));this.selectedCountry.name=a&&a.name||""}}},rotateFromDragEvent:function(t){var e=this.projection.rotate(),i=this.dragSensitivity/this.projection.scale();this.rotations={yaw:e[0]+t.dx*i,pitch:e[1]-t.dy*i,roll:this.rotations.roll}},getDistanceBetweenTwoPoints:function(t){return Math.sqrt(Math.pow(t[0][0]-t[1][0],2)+Math.pow(t[0][1]-t[1][1],2))},scaleFromPinchTouches:function(t){if(this.lastPinchDistance){var e=this.getDistanceBetweenTwoPoints(t);if(e===this.lastPinchDistance)return;e>this.lastPinchDistance?this.scale=Math.min(1e4,this.scale*(1+this.zoomSensitivity)):this.scale=Math.max(60,this.scale*(1-this.zoomSensitivity))}this.lastPinchDistance=this.getDistanceBetweenTwoPoints(t)},onMouseMove:function(){var t=s.h(s.c.target);this.selectCountryFromPosition(t)},onZoom:function(){this.scale=this.radius*s.c.transform.k},onDragStart:function(){var t=s.m(s.c.sourceEvent.target);t.length<2?(this.isRotating=!this.isRotating,this.isBeingDragged=!0):2===t.length&&(this.lastPinchDistance=this.getDistanceBetweenTwoPoints(t))},onDrag:function(){var t=s.m(s.c.sourceEvent.target);t.length<2?(this.rotateFromDragEvent(s.c),this.isBeingDragged=!0):2===t.length&&this.scaleFromPinchTouches(t)},onDragEnd:function(){this.isBeingDragged&&(this.isRotating=!this.isRotating,this.isBeingDragged=!1)},render:function(){var t=this;this.context.clearRect(0,0,this.width,this.height),this.context.lineWidth=1.5,this.context.fillStyle=this.colors.water,this.context.beginPath(),this.path({type:"Sphere"}),this.context.fill(),this.context.stroke(),this.context.lineWidth=.35,this.context.fillStyle=this.colors.land,this.context.beginPath(),this.path(this.worldCountries),this.context.fill(),this.context.stroke(),void 0!==this.selectedCountry&&(this.context.beginPath(),this.path(this.selectedCountry),this.context.fillStyle=this.colors.selectedCountry,this.context.fill());var e=s.a(this.colors.earthquake);e.opacity=.5,this.context.fillStyle=e;var i=this.path.pointRadius;this.path.pointRadius((function(e){return t.earthquakeMagnitudeScale(Math.exp(e.properties.mag))})),this.earthquakes.features.forEach((function(e){t.context.beginPath(),t.path(e),t.context.fill(),t.context.stroke()})),this.path.pointRadius(i)},draw:function(t){if(!this.isDrawing){this.isDrawing=!0;var e=s.i(),i=e-this.lastDrawLoopCallTime;i<t&&(this.isRotating&&(this.rotations={yaw:this.rotations.yaw+=i*this.autoRotationDegPerMilliSec,pitch:this.rotations.pitch,roll:this.rotations.roll}),this.isMounted&&this.isDataFetched&&this.render()),this.lastDrawLoopCallTime=e,this.isDrawing=!1}}}},c=i(37),h=i(42),u=i.n(h),l=i(359),d=i(306),g=i(360),v=Object(c.a)(r,(function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("v-container",[i("v-row",{attrs:{align:"center",justify:"center"}},[i("v-col",{attrs:{align:"center"}},[t.isDataFetched?t._e():i("div",[t._v("\n        Fetching Data\n        "),i("span",{staticClass:"ml-2"},[i("font-awesome-icon",{attrs:{icon:["fas","spinner"],pulse:""}})],1)])])],1),t._v(" "),i("v-row",{attrs:{align:"center",justify:"center"}},[i("v-col",{attrs:{id:"canvasContainer",align:"center"}})],1),t._v(" "),i("v-row",{attrs:{align:"center",justify:"center"}},[i("v-col",{attrs:{align:"center"}},[void 0!==t.selectedCountry?i("div",[t._v("\n        "+t._s(t.selectedCountry.name)+"\n      ")]):t._e()])],1)],1)}),[],!1,null,null,null),f=v.exports;u()(v,{VCol:l.a,VContainer:d.a,VRow:g.a});var w={components:{Globe:f},data:function(){return{title:"Covid Athenaeum"}},head:function(){return{title:this.title,meta:[{hid:"description",name:"description",content:"Learn about COVID-19"}]}}},p=(i(355),Object(c.a)(w,(function(){var t=this.$createElement,e=this._self._c||t;return e("div",[e("Globe")],1)}),[],!1,null,null,null));e.default=p.exports}}]);